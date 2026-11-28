"""teilen API definition."""

import sys
from urllib.parse import quote, unquote
from importlib.metadata import version
from pathlib import Path
from datetime import datetime
from time import sleep, time
from dataclasses import dataclass, field
import threading
from uuid import uuid4
import zipfile
from tempfile import mkdtemp
import atexit

from teilen.webcan import Handler, StaticHandler, Response, Request, HTTPError
from teilen.config import AppConfig


class AuthHandler(Handler):
    """Authorization handler."""

    path = "/auth"
    X_TEILEN_AUTH = "x_teilen_auth"

    def __init__(self, config: AppConfig, **kwargs):
        super().__init__(**kwargs)
        self.config = config

    @classmethod
    def require_password(cls, password: str | None, request: Request) -> None:
        """Validates password authorization.

        :raises HTTPError: If not allowed.
        """
        if password is None:
            return

        if unquote(request.cookies.get(cls.X_TEILEN_AUTH, "")) == password:
            return

        raise HTTPError(403, "Forbidden.")

    def _add_set_cookie_header(self, response: Response) -> Response:
        response.headers["Set-Cookie"] = (
            f"{self.X_TEILEN_AUTH}={quote(self.config.password, safe='')}; "
            + "Path=/; Max-Age=3600; HttpOnly; SameSite=Lax"
        )
        return response

    def get(self, request: Request):
        """Assert valid login."""
        self.require_password(self.config.password, request)
        return self._add_set_cookie_header(Response.text("OK"))

    def post(self, request: Request):
        """Perform login, reading password from json."""
        if self.config.password is None:
            return Response.text("OK")

        try:
            self.require_password(self.config.password, request)
            return self._add_set_cookie_header(Response.text("OK"))
        except HTTPError:
            pass

        if request.json().get("password") != self.config.password:
            raise HTTPError(403, "Forbidden.")

        return self._add_set_cookie_header(Response.text("OK"))


class FallbackHandler(StaticHandler):
    """Fallback handler for better SPA-routing."""

    path = "{filepath:multisegment}"

    def get(self, request: Request):
        path = Path(request.path.lstrip("/"))

        # exclude API
        if path.parts and path.parts[0].lower() == "api":
            raise HTTPError(404, "Unknown endpoint.")

        # exclude files
        if path.parts and path.parts[0].lower() == "static":
            raise HTTPError(404, "Not found.")

        return super().get(request)


class ProtectedStaticHandler(StaticHandler):
    """Static handler with authorization."""

    path = "{filepath:multisegment}"

    def __init__(self, config: AppConfig, **kwargs):
        super().__init__(**kwargs)
        self.config = config

    def get(self, request: Request):
        AuthHandler.require_password(self.config.password, request)
        return super().get(request)


class ConfigurationHandler(Handler):
    """Configuration API-handler."""

    path = "/configuration"

    def __init__(self, config: AppConfig, **kwargs):
        super().__init__(**kwargs)
        self.config = config
        self.version = version("teilen")

    def get(self, request):
        return Response.json(
            {
                "version": self.version,
                "passwordRequired": self.config.password is not None,
            }
        )


class ItemsHandler(Handler):
    """Items API-handler."""

    path = "/items"

    def __init__(self, config: AppConfig, **kwargs):
        super().__init__(**kwargs)
        self.config = config

    def get(self, request: Request):
        """
        Returns items in a given location defaulting to root.

        Reads requested path as quoted string from query argument "path".
        """
        AuthHandler.require_password(self.config.password, request)

        path_arg = ""
        try:
            path_arg = request.query_params["path"][0]
        except (KeyError, IndexError):
            pass
        target_path = (self.config.working_dir / unquote(path_arg)).resolve()

        # check for issues
        if not target_path.is_relative_to(self.config.working_dir):
            print(
                f"Prevented path traversal attempt targeting '{target_path}'.",
                file=sys.stderr,
            )
            return Response.text("Not allowed.", 403)
        if not target_path.is_dir():
            return Response.text("Does not exist.", 404)

        contents = list(target_path.glob("*"))
        folders = list(filter(lambda p: p.is_dir() and not p.is_symlink(), contents))
        files = list(filter(lambda p: p.is_file() and not p.is_symlink(), contents))
        return Response.json(
            {
                "meta": {
                    "total": len(folders) + len(files),
                    "timestamp": datetime.now().isoformat(),
                    "path": str(target_path.relative_to(self.config.working_dir)),
                },
                "data": {
                    "items": [
                        {
                            "kind": "directory",
                            "name": f.name,
                            "mtime": f.stat().st_mtime,
                        }
                        for f in folders
                    ]
                    + [
                        {
                            "kind": "file",
                            "name": f.name,
                            "mtime": f.stat().st_mtime,
                            "size": f.stat().st_size,
                        }
                        for f in files
                    ]
                },
            }
        )


class ArchiveHandler(Handler):
    """Archive API-handler."""

    path = "/archives"

    @dataclass
    class ArchiveJob:
        """Record class for archival job tracking."""

        targets: list[Path]
        destination: Path
        id_: str = field(default_factory=lambda: str(uuid4()))
        size: int = 0
        progress: int = 0
        completed: bool = False
        success: bool | None = None
        completed_at: float | None = None

        @property
        def json(self):
            """Returns JSON-serializable job metadata."""
            return {
                "id": self.id_,
                "totalFiles": len(self.targets),
                "size": self.size,
                "progress": self.progress,
                "completed": self.completed,
            }

    def __init__(self, config: AppConfig, **kwargs):
        super().__init__(**kwargs)
        self.config = config
        self._jobs: dict[str, self.ArchiveJob] = {}
        self._jobs_lock = threading.RLock()

    def plan_cleanup(self):
        """Registers exit-handlers and starts a cleanup routine at runtime."""

        def _cleanup(purge: bool = False):
            now = time()
            for job in filter(
                lambda j: purge
                or (
                    j.completed_at is not None
                    and now > j.completed_at + self.config.archives_ttl
                ),
                list(self._jobs.values()),
            ):
                print(
                    f"[{datetime.now().isoformat()} - {job.id_}] Cleaning up '{job.destination}'.",
                    file=sys.stderr,
                )
                job.destination.unlink(missing_ok=True)
                job.destination.parent.rmdir()
                with self._jobs_lock:
                    del self._jobs[job.id_]

        def _cleanup_loop():
            while True:
                sleep(self.config.archives_ttl)
                if len(self._jobs) == 0:
                    continue
                print(
                    f"[{datetime.now().isoformat()}] Running cleanup.",
                    file=sys.stderr,
                )
                _cleanup()
                print(
                    f"[{datetime.now().isoformat()}] Cleanup completed.",
                    file=sys.stderr,
                )

        atexit.register(_cleanup, True)
        threading.Thread(target=_cleanup_loop, daemon=True).start()

        print(
            f"[{datetime.now().isoformat()}] Cleanup has been planned.",
            file=sys.stderr,
        )

    def create_archive(self, job: ArchiveJob, location: Path):
        """
        Builds an archive. Progress updates are written to the given job
        object.

        :param job: ArchiveJob description
        :param location: base path for archive contents
        """
        print(
            f"[{datetime.now().isoformat()} - {job.id_}] Creating archive in '{job.destination}'.",
            file=sys.stderr,
        )

        try:
            with zipfile.ZipFile(job.destination, "w", zipfile.ZIP_STORED) as archive:
                for t in job.targets:
                    archive.write(
                        t,
                        t.resolve().relative_to(location.resolve()),
                    )
                    job.size = job.destination.stat().st_size
                    job.progress += 1

            job.success = True
            print(
                f"[{datetime.now().isoformat()} - {job.id_}] Building archive successful.",
                file=sys.stderr,
            )
        except Exception as e:
            job.success = False
            print(
                f"[{datetime.now().isoformat()} - {job.id_}] Failed to build archive: {e}.",
                file=sys.stderr,
            )
        finally:
            job.completed = True
            job.completed_at = time()

    def get(self, request: Request):
        """
        Returns either archive file or archive job status if the query argument
        "status" is provided. Archive (job) id is read from the "id" query
        argument.
        """
        AuthHandler.require_password(self.config.password, request)

        try:
            job_id = request.query_params["id"][0]
        except (KeyError, IndexError):
            return Response.text("Missing archive/job id.", 400)
        check_status = "status" in request.query_params

        if job_id not in self._jobs:
            return Response.text("Unknown or expired archive/job.", 404)

        if check_status:
            return Response.json(self._jobs[job_id].json)

        if not self._jobs[job_id].destination.is_file():
            return Response.text("Unknown or expired archive/job.", 404)

        return Response.file(self._jobs[job_id].destination)

    def post(self, request: Request):
        """
        Create archiving-job and return job's ID.

        Read targets from JSON body
        - field 'targets' (array of paths)
        - location (relative path base in archive)
        """
        AuthHandler.require_password(self.config.password, request)

        request_json = request.json()
        location = (
            self.config.working_dir / request_json.get("location", "")
        ).resolve()
        if not location.is_relative_to(self.config.working_dir):
            return Response.text("Not allowed.", 403)

        raw_targets = list(
            map(
                lambda t: (self.config.working_dir / t).resolve(),
                request_json.get("targets", []),
            )
        )
        if len(raw_targets) == 0:
            return Response.text("Missing target.", 400)

        # resolve, collect and validate individual files from raw targets
        targets = []
        for target in raw_targets:
            if not target.is_relative_to(self.config.working_dir):
                print(
                    f"Prevented path traversal attempt targeting '{target}'.",
                    file=sys.stderr,
                )
                return Response.text("Not allowed.", 403)
            if not target.exists():
                return Response.text("Does not exist.", 404)

            if target.is_file() and not target.is_symlink():
                targets.append(target)
            if target.is_dir() and not target.is_symlink():
                targets.extend(
                    filter(
                        lambda p: p.is_file() and not p.is_symlink(),
                        target.glob("**/*"),
                    )
                )

        tmp_dir = Path(mkdtemp(prefix="teilen-")).resolve()
        job = self.ArchiveJob(targets, (tmp_dir / "archive").with_suffix(".zip"))
        with self._jobs_lock:
            self._jobs[job.id_] = job
        threading.Thread(
            target=self.create_archive, args=(job, location), daemon=True
        ).start()
        return Response.json({"id": job.id_})

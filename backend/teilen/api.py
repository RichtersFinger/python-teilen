"""teilen api-definition"""

from typing import Optional
from functools import wraps
from pathlib import Path
from urllib.parse import unquote
from datetime import datetime
from tempfile import mkdtemp
import zipfile
from uuid import uuid4
import multiprocessing
from shutil import rmtree
import atexit

from flask import (
    Flask,
    Response,
    jsonify,
    request,
    send_file,
    send_from_directory,
)

from teilen.config import AppConfig


def login_required(password: Optional[str]):
    """Protect endpoint with auth via 'X-Teilen-Auth'-header."""

    def decorator(route):
        @wraps(route)
        def __():
            if request.headers.get("X-Teilen-Auth") != password:
                return Response("FAILED", mimetype="text/plain", status=401)
            return route()

        return __

    return decorator


def create_archive(id_: str, source: Path, tmp_dir: Path):
    """
    Builds an archive from the data in `source` in
    `tmp_dir/id_/(source.name + ".zip")`. Creates done-file after
    completion containing archive-file name.
    """
    working_dir = tmp_dir / id_
    working_dir.mkdir()
    destination = working_dir / (source.name + ".zip")
    print(
        f"[{datetime.now().isoformat()} - {id_}] Creating archive for "
        + f"'{source}' in '{destination}'."
    )

    # create archive
    with zipfile.ZipFile(destination, "w", zipfile.ZIP_STORED) as archive:
        for f in source.glob("**/*"):
            if f.is_file():
                archive.write(
                    f,
                    f.resolve().relative_to(
                        source.parent.resolve()
                    ),
                )

    # create done-file to indicate success
    (working_dir / "done").write_text(destination.name, encoding="utf-8")
    print(
        f"[{datetime.now().isoformat()} - {id_}] Building archive successful."
    )


def register_api(app: Flask, config: AppConfig):
    """Sets up api endpoints."""

    archive_store = {}
    tmp_dir = Path(mkdtemp(prefix="teilen-")).resolve()
    atexit.register(rmtree, tmp_dir)

    @app.route("/configuration", methods=["GET"])
    def get_configuration():
        """
        Get basic info on configuration.
        """
        return jsonify({"passwordRequired": config.PASSWORD is not None}), 200

    @app.route("/login", methods=["GET"])
    @login_required(config.PASSWORD)
    def get_login():
        """
        Test login.
        """
        return Response("OK", mimetype="text/plain", status=200)

    def get_location(provide_default: bool = True) -> Optional[Path]:
        """Parse and return location-arg."""
        if request.args.get("location") is None:
            if provide_default:
                return config.WORKING_DIR
            return None
        return (
            config.WORKING_DIR / unquote(request.args["location"])
        ).resolve()

    @app.route("/contents", methods=["GET"])
    @login_required(config.PASSWORD)
    def get_contents():
        """
        Returns contents for given location.
        """
        _location = get_location()

        # check for problems
        if (
            config.WORKING_DIR != _location
            and config.WORKING_DIR not in _location.parents
        ):
            return Response("Not allowed.", mimetype="text/plain", status=403)
        if not _location.is_dir():
            return Response(
                "Does not exist.", mimetype="text/plain", status=404
            )

        contents = list(_location.glob("*"))
        folders = filter(lambda p: p.is_dir(), contents)
        files = filter(lambda p: p.is_file(), contents)
        return (
            jsonify(
                [
                    {
                        "type": "folder",
                        "name": f.name,
                        "mtime": f.stat().st_mtime,
                    }
                    for f in folders
                ]
                + [
                    {
                        "type": "file",
                        "name": f.name,
                        "mtime": f.stat().st_mtime,
                        "size": f.stat().st_size,
                    }
                    for f in files
                ]
            ),
            200,
        )

    @app.route("/content", methods=["GET"])
    @login_required(config.PASSWORD)
    def get_content():
        """
        Returns file for given location or an id for an archive-job.
        """
        _location = get_location(False)
        # if forStatus, client only wants to validate request
        for_status = request.args.get("forStatus") is not None

        if _location is None:
            return Response(
                "Missing 'location' arg.", mimetype="text/plain", status=400
            )

        # check for problems
        if config.WORKING_DIR not in _location.parents:
            return Response("Not allowed.", mimetype="text/plain", status=403)
        if not _location.exists():
            return Response(
                "Does not exist.", mimetype="text/plain", status=404
            )

        if _location.is_file():
            if for_status:
                return Response("OK", mimetype="text/plain", status=200)
            return send_from_directory(
                config.WORKING_DIR,
                _location.relative_to(config.WORKING_DIR),
                as_attachment=True,
            )

        # create asynchronous job to build archive
        if _location.is_dir():
            # check already running jobs
            n_jobs = 0
            for job in archive_store.values():
                if "process" in job and job["process"].is_alive():
                    n_jobs += 1
            if n_jobs > config.ARCHIVE_BUILD_CONCURRENCY:
                return Response("BUSY", mimetype="text/plain", status=503)

            # run job
            # no threading-lock needed here because of uuids
            job_id = str(uuid4())
            archive_store[job_id] = {
                "id": job_id,
                "process": multiprocessing.Process(
                    target=create_archive,
                    args=(job_id, _location.resolve(), tmp_dir),
                    daemon=True,
                ),
            }
            archive_store[job_id]["process"].start()

            return jsonify({"id": job_id}), 202

        return Response("Unkown type.", mimetype="text/plain", status=501)

    @app.route("/archive", methods=["GET"])
    @login_required(config.PASSWORD)
    def get_archive():
        """Returns result of an archive-job if ready."""
        job_id = request.args.get("id")
        # if forStatus, client only wants to validate request
        for_status = request.args.get("forStatus") is not None

        # validate etc.
        if job_id is None:
            return Response("MISSING ID", mimetype="text/plain", status=400)

        if job_id not in archive_store:
            return Response("UNKNOWN ID", mimetype="text/plain", status=404)

        if archive_store[job_id]["process"].is_alive():
            return Response("NOT YET", mimetype="text/plain", status=202)

        if not (tmp_dir / job_id / "done").is_file():
            return Response(
                "RESULT DOES NOT EXIST", mimetype="text/plain", status=404
            )

        archive = (
            tmp_dir
            / job_id
            / (tmp_dir / job_id / "done").read_text(encoding="utf-8")
        )

        if not archive.is_file():
            return Response(
                "RESULT DOES NOT EXIST", mimetype="text/plain", status=404
            )

        # return result
        if for_status:
            return Response("OK", mimetype="text/plain", status=200)
        return send_file(archive, as_attachment=True)

    @app.route("/archive", methods=["DELETE"])
    @login_required(config.PASSWORD)
    def delete_archive():
        """Clean up created archive or abort creation."""
        job_id = request.args.get("id")

        # validate etc.
        if job_id is None:
            return Response("MISSING ID", mimetype="text/plain", status=400)

        if job_id not in archive_store:
            return Response("UNKNOWN ID", mimetype="text/plain", status=404)

        # abort and delete artifacts
        if archive_store[job_id]["process"].is_alive():
            archive_store[job_id]["process"].kill()
            archive_store[job_id]["process"].join()

        rmtree(tmp_dir / job_id)
        return Response("DELETED", mimetype="text/plain", status=200)

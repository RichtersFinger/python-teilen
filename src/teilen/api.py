"""teilen API definition."""

import sys
from urllib.parse import unquote
from importlib.metadata import version
from pathlib import Path
from datetime import datetime

from teilen.webcan import Handler, StaticHandler, Response, Request, HTTPError
from teilen.config import AppConfig


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
        folders = list(
            filter(lambda p: p.is_dir() and not p.is_symlink(), contents)
        )
        files = list(
            filter(lambda p: p.is_file() and not p.is_symlink(), contents)
        )
        return Response.json(
            {
                "meta": {
                    "total": len(folders) + len(files),
                    "timestamp": datetime.now().isoformat(),
                    "path": str(
                        target_path.relative_to(self.config.working_dir)
                    ),
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

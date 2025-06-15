"""teilen api-definition"""

from typing import Optional
from functools import wraps
from pathlib import Path
from urllib.parse import unquote

from flask import Flask, Response, jsonify, request, send_from_directory

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


def register_api(app: Flask, config: AppConfig):
    """Sets up api endpoints."""

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
        return Path(unquote(request.args["location"]))

    @app.route("/contents", methods=["GET"])
    @login_required(config.PASSWORD)
    def get_contents():
        """
        Returns contents for given location.
        """
        _location = get_location()

        # check for problems
        if _location.is_absolute():
            return Response(
                "Only relative paths are supported.",
                mimetype="text/plain",
                status=403,
            )
        try:
            if (
                not _location.resolve()
                .relative_to(config.WORKING_DIR)
                .is_dir()
            ):
                return Response(
                    "Does not exist.", mimetype="text/plain", status=404
                )
        except ValueError:
            return Response("Not allowed.", mimetype="text/plain", status=403)

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
        Returns file/folder (as archive) for given location.
        """
        _location = get_location(False)
        if _location is None:
            return Response(
                "Missing 'location' arg.", mimetype="text/plain", status=400
            )

        # check for problems
        if _location.is_absolute():
            return Response(
                "Only relative paths are supported.",
                mimetype="text/plain",
                status=403,
            )
        try:
            if (
                not _location.resolve()
                .relative_to(config.WORKING_DIR)
                .exists()
            ):
                return Response(
                    "Does not exist.", mimetype="text/plain", status=404
                )
        except ValueError:
            return Response("Not allowed.", mimetype="text/plain", status=403)

        if _location.is_file():
            return send_from_directory(
                config.WORKING_DIR, _location, as_attachment=True
            )
        return Response("Not implemented.", mimetype="text/plain", status=501)

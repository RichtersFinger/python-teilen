"""teilen API definition."""

from importlib.metadata import version
from pathlib import Path

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

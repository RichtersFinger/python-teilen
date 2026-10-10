"""teilen API definition."""

from importlib.metadata import version

from teilen.webcan import Handler, Response
from teilen.config import AppConfig


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

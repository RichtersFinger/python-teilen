"""Define app for flask-cli."""

from teilen.config import AppConfig
from teilen.app import app_factory

config = AppConfig()
app = app_factory(config)

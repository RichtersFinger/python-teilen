"""Development server entry point."""

from pathlib import Path

from teilen.webcan import run_dev as webcan_run_dev
from teilen.config import AppConfig
from teilen.app import app_factory


_dev_config = AppConfig(mode="dev", static_path=Path("src/teilen/frontend"))
_dev_app = app_factory(_dev_config)


def _dev_app_factory():
    print(f"Running dev server at localhost:{_dev_config.port}")
    return _dev_app


if __name__ == "__main__":
    webcan_run_dev(
        _dev_app_factory,
        "0.0.0.0",
        _dev_config.port,
        watch_paths=[Path("src/teilen")],
    )

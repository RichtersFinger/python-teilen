"""Development server entry point."""

from pathlib import Path

from teilen.webcan import run_dev as webcan_run_dev
from teilen.config import AppConfig
from teilen.app import app_factory


_dev_config = AppConfig(
    mode="dev",
    bind="0.0.0.0",
    static_path=Path("src/teilen/frontend"),
)
_dev_app = app_factory(_dev_config)
_dev_app.set_on_startup(
    lambda _: print(
        f"Running dev server at {_dev_config.bind}:{_dev_config.port}"
    )
)


if __name__ == "__main__":
    webcan_run_dev(
        lambda: _dev_app,
        _dev_config.bind,
        _dev_config.port,
        watch_paths=[Path("src/teilen")],
    )

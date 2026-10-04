"""teilen backend configuration."""

import os
from pathlib import Path

import teilen


class AppConfig:
    """teilen-backend configuration."""

    MODE = os.environ.get("MODE", "prod")  # "prod" | "dev"
    PORT = os.environ.get("PORT", "27183" if MODE == "prod" else "5000")

    STATIC_PATH = Path(teilen.__file__).parent / "frontend"
    SESSION_COOKIE_NAME = "teilen_session"
    WORKING_DIR = Path(os.environ.get("WORKING_DIR", Path.cwd())).resolve()
    PASSWORD = os.environ.get("PASSWORD")
    ARCHIVE_BUILD_CONCURRENCY = int(
        os.environ.get("ARCHIVE_BUILD_CONCURRENCY", 3)
    )

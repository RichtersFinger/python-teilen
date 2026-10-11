"""teilen backend configuration."""

import os
from pathlib import Path
from dataclasses import dataclass, field

import teilen


@dataclass(kw_only=True)
class AppConfig:
    """teilen-backend configuration."""

    mode: str = os.environ.get("MODE", "prod")  # "prod" | "dev"
    bind: str = os.environ.get("BIND", "127.0.0.1")
    port: int = int(os.environ.get("PORT", "27183"))

    static_path: Path = Path(teilen.__file__).parent / "frontend"
    session_cookie_name: str = field(default_factory=lambda: "teilen_session")
    working_dir: Path = Path(
        os.environ.get("WORKING_DIR", Path.cwd())
    ).resolve()
    password: str | None = os.environ.get("PASSWORD")
    archive_build_concurrency: int = int(
        os.environ.get("ARCHIVE_BUILD_CONCURRENCY", 3)
    )

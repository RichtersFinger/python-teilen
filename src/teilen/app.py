"""teilen-backend definition."""

import sys
from pathlib import Path
import socket
import urllib.request
from importlib.metadata import version

import teilen
from teilen.webcan import App
from teilen.config import AppConfig


def load_callback_url_options() -> list[dict]:
    """
    Returns a list of IP-addresses with a name.

    Every record contains the fields 'name' and 'address'.
    """
    options = []

    # get LAN-address (https://stackoverflow.com/a/28950776)
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        s.connect(("10.254.254.254", 1))
        options.append(
            {"address": "http://" + s.getsockname()[0], "name": "local"}
        )
    # pylint: disable=broad-exception-caught
    except Exception:
        pass
    finally:
        s.close()

    # get global IP
    try:
        with urllib.request.urlopen(
            "https://api.ipify.org", timeout=1
        ) as response:
            options.append(
                {
                    "address": "http://" + response.read().decode("utf-8"),
                    "name": "global",
                }
            )
    # pylint: disable=broad-exception-caught
    except Exception:
        pass

    return options


def print_welcome_message(config: AppConfig) -> None:
    """Prints welcome message to stdout."""
    url_options = load_callback_url_options()
    lines = (
        (["Running in dev-mode."] if config.MODE == "dev" else [])
        + [
            "Your teilen-instance will be available shortly.",
            "",
            "The contents of the following directory will be available:",
            (
                str(config.WORKING_DIR)[:30]
                + "..."
                + str(config.WORKING_DIR)[-30:]
                if len(str(config.WORKING_DIR)) > 70
                else str(config.WORKING_DIR)
            ),
        ]
        + (
            ["Password protection is active."]
            if config.PASSWORD is not None
            else []
        )
        + (
            ["", "The following addresses have been detected automatically:"]
            if url_options
            else []
        )
        + list(
            map(
                lambda o: f" * {o['name']}: {o['address']}:{config.PORT}",
                url_options,
            )
        )
    )
    delimiter = "#" * (max(map(len, lines)) + 4)
    print(delimiter)
    for line in lines:
        print(f"# {line}{' '*(len(delimiter) - len(line) - 4)} #")
    print(delimiter)


def app_factory(config: AppConfig) -> App:
    """Returns teilen app."""

    app_ = App()

    # TODO: add API endpoints

    app_.serve_static("/", config.STATIC_PATH)

    return app_


def parse_cmdline_args(config: AppConfig):
    """Update config using command line arguments."""

    if "-h" in sys.argv or "--help" in sys.argv:
        print(f"""Open a teilen-share
Software version: {version("teilen")}

Usage: teilen [options] [path]

Options:
  -h, --help                        Output this message and exit.
  -p, --password                    Set a password-requirement for this
                                    share.
  --port                            Set a specific port to run on.
                                    [Default {config.PORT}]

Arguments:
  path                              path to the directory that is shared
                                    [Default current working directory]
""", end="")
        sys.exit(0)

    index = 1
    while True:
        if index >= len(sys.argv):
            break

        # password
        if sys.argv[index] in ["-p", "--password"]:
            if len(sys.argv) <= index + 1:
                print(
                    "\033[1;31mERROR\033[0m: "
                    + f"Missing value for option '{sys.argv[index]}'.",
                    file=sys.stderr,
                )
                sys.exit(1)
            config.PASSWORD = sys.argv[index + 1]
            index += 2
            continue

        # port
        if sys.argv[index] in ["--port"]:
            if len(sys.argv) <= index + 1:
                print(
                    "\033[1;31mERROR\033[0m: "
                    + f"Missing value for option '{sys.argv[index]}'.",
                    file=sys.stderr,
                )
                sys.exit(1)
            config.PORT = sys.argv[index + 1]
            index += 2
            continue

        # working directory (should by the last and a singular argument)
        if len(sys.argv) > index + 1:
            print(
                "\033[1;31mERROR\033[0m: "
                + f"Unknown option '{sys.argv[index]}'.",
                file=sys.stderr,
            )
            sys.exit(1)
        config.WORKING_DIR = Path(sys.argv[index]).resolve()
        index += 1


def run(app=None, config=None):
    """Run app."""
    # load default config
    if not config:
        config = AppConfig()

    # parse command line arguments
    parse_cmdline_args(config)

    # load default app
    if not app:
        app = app_factory(config)

    # not intended for production due to, e.g., cors
    if config.MODE != "prod":
        print(
            "\033[1;33mWARNING\033[0m: "
            + f"Running in unexpected MODE '{config.Mode}'.",
            file=sys.stderr,
        )

    print_welcome_message(config)

    # TODO: run with dev-mode if requested
    app.run("0.0.0.0", int(config.PORT))

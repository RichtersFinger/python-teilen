# teilen

A simple application to share data via http with python flask backend and react frontend.

Share the contents of a local directory with a single command over the network.

It features
* a lightweight and responsive interface,
* downloads for entire directories as ZIP-files, and
* a simple authentication-system.

See the [demo-gallery](https://github.com/RichtersFinger/python-teilen/blob/main/gallery/gallery.md) for some impressions.

## Install
`teilen` can be installed using `pip` by entering
```
pip install teilen
```
It is recommended to use a virtual environment
```
python3 -m venv venv
source venv/bin/activate
```

## Run
After installing, run the `teilen`-application with
```
teilen <path/to/directory>
```
By default, the web-UI is available at `http://localhost:27183`.
If you are done, stop by hitting `Ctrl`+`C`.

### Command line options
* the last argument to the cli is interpreted as the path to the directory that should be shared, e.g.,
  ```
  teilen <options> <path/to/directory>
  ```
  omit to share the current working directory
* `-p`, `--password`: (optionally) set a password that is required to access the share

  The authentication method is implement via a custom request-header `X-Teilen-Auth` that, if the option is set, is required for any content-related endpoints of the `teilen`-API.
* `--port`: (optionally) changes the port that the application is running on (default is 27183)

## Update
Run
```
pip install teilen --upgrade
```
to get the latest version.

## Environment configuration
The following environment variables can be set to configure `teilen`:

- `WORKING_DIR` [DEFAULT \<cwd>] path to the shared directory (see also the argument to the cli)
- `PASSWORD` [DEFAULT null] optional password to access the share (see also the cli-option `-p`, `--password`)
- `PORT` [DEFAULT 27183] teilen port (see also the cli-option `--port`)
- `SECRET_KEY` [DEFAULT \<random uuid>] secret key

### Running in dev-mode
The development setup requires both `python3` and the node package manager `npm` to be installed.
Contrary to the pure python production server, back- and frontend are run separately in the development context.

To run the backend server, enter
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install .
pip install -r dev-requirements.txt
MODE=dev flask run
```

Based on pre-defined scripts, the frontend development server can be started with
```
cd frontend
npm install
npm start
```

The client can then be accessed via the node-development server at `http://localhost:3000`.

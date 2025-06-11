# teilen

A simple application to share data via http with python flask backend and react frontend.

Share the contents of a local directory with a single command over the network.

See the [demo-gallery](./gallery/gallery.md) for some impressions.

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

## Update
Run
```
pip install teilen --upgrade
```
to get the latest version.

## Environment configuration
The following environment variables can be set to configure `teilen`:

- `PORT` [DEFAULT 27183] teilen port

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

PYTHON_IMAGE := python:3.14.7-alpine@sha256:4677924bcc0e94505a3270e87cb1601c2af54cd92d021b8dc306618a14333bbe
PYTHON := docker run --rm -it -p 5000:27183 -v ./:/teilen -w /teilen ${PYTHON_IMAGE}

shell:
	${PYTHON} sh

build: clean
	${PYTHON} sh -c "pip install --uploaded-prior-to P14D 'build==1.6.1' && python -m build --wheel && rm -r build/"

clean:
	rm -rf __pycache__ **/__pycache__ teilen.egg-info build dist

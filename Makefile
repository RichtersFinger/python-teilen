SHELL := /bin/bash
VENV := venv
SKIP_CLIENT =
VERSION =

_:
	echo "Missing target. See README for details."

venv:
	[ -d "${VENV}" ] || python3 -m venv venv

ifeq ($(SKIP_CLIENT), yes)
$(info skipping client!)
build-frontend:
else
build-frontend:
	cd frontend && \
		npm install && \
		GENERATE_SOURCEMAP=false npm run build
endif

build-backend:
	rm -rf backend/teilen/client
	cp -r frontend/build backend/teilen/client

build: venv build-frontend build-backend
	[ "${VERSION}" != "" ] && \
		VERSIONENV="VERSION=${VERSION}" || \
		echo "Using default version"
	source "${VENV}/bin/activate" && \
		pip install --upgrade pip wheel setuptools && \
		cd backend && \
		${VERSIONENV} python3 setup.py sdist bdist_wheel || \
		python3 setup.py sdist bdist_wheel

publish: venv
	source "${VENV}/bin/activate" && \
		pip install --upgrade pip twine && \
		cd backend && \
		python3 -m twine upload dist/*

clean:
	git clean -dfX

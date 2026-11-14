APP_SERVICE_NAME := teilen-dev-app

check:
	[ "$$(docker ps -a | grep ${APP_SERVICE_NAME})" ] || (echo "Run 'docker compose up' first" && exit 1)

shell: check
	docker exec -it ${APP_SERVICE_NAME} sh

build: clean check
	docker exec -it ${APP_SERVICE_NAME} sh -c "pip install --uploaded-prior-to P14D 'build==1.6.1' && python -m build --wheel && rm -r build/"

clean:
	rm -rf __pycache__ **/__pycache__ teilen.egg-info build dist

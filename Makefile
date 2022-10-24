docker: Dockerfile provision build
	docker build --tag openbadges-image . && \
	docker run -d --name openbadges \
	-e HOST_ENV=localhost \
	-v ${PWD}/data:/var/www/openbadges/data \
	-v ${PWD}/keys:/var/www/openbadges/keys \
	-p 8080:8080 \
	openbadges-image

build: node_modules
	./node_modules/.bin/react-scripts build

clean:
	rm -rf ./node_modules

start: node_modules provision build
	node server.js

provision:
	./bin/provision

.PHONY: clean docker provision start build

node_modules: package.json
	npm install --ignore-scripts

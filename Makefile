all: build

deps:
	@echo "installing dependencies ..."	
	@npm i

build: deps
	@echo "building ui ..."
	@export NODE_OPTIONS=--openssl-legacy-provider
	@ng build --prod




all: build

deps:
	@echo "installing dependencies ..."	
	@NODE_OPTIONS=--openssl-legacy-provider npm i --legacy-peer-deps

build: deps
	@echo "building ui ..."
	@NODE_OPTIONS=--openssl-legacy-provider ng build --prod   




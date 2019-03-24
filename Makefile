clean:
	@echo "cleaning ..."
	@rm -rf dist ui.zip

deps:
	@echo "installing dependencies ..."
	@npm i

build: deps
	@echo "buiding ui ..."
	@ng build --prod

zip: build
	@echo "creating ui.zip ..."
	@cd dist && zip -r ../ui.zip . && cd ..

install:
	@echo "installing to /usr/local/share/bettercap/ui ..."
	@cp -rf dist/ui /usr/local/share/bettercap/ui

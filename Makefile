clean:
	@echo "cleaning ..."
	@rm -rf dist ui.zip

build:
	@echo "buiding ui ..."
	@ng build --prod

zip: build
	@echo "creating ui.zip ..."
	@rm -rf ui.zip
	@cd dist && zip -r ../ui.zip . && cd ..

install:
	@echo "installing to /usr/local/share/bettercap/ui ..."
	@cp -rf dist/ui /usr/local/share/bettercap/ui

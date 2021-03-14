deps:
	@echo "installing dependencies ..."	
	@npm i

build: deps
	@echo "building ui ..."
	@ng build --prod

zip: build
	@echo "creating ui.zip ..."
	@rm -rf ui.zip
	@cd dist && zip -r ../ui.zip . && cd ..

install: build
	@echo "installing to /usr/local/share/bettercap/ui ..."
	@cp -rf dist/ui /usr/local/share/bettercap/ui

clean:
	@echo "cleaning ..."
	@rm -rf dist ui.zip



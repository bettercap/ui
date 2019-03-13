<p align="center">
  <img alt="Hydra" src="https://github.com/guizzo/hydra/blob/master/src/assets/images/logo.png" height="140" />
  <p align="center">
    <a href="https://github.com/bettercap/bettercap/blob/master/LICENSE.md"><img alt="Software License" src="https://img.shields.io/badge/license-GPL3-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

# Hydra

**This project is still work in progress**. 

In order to run the web ui, first build the project:

```sh
cd /path/to/hydra
npm run build
```

This will generate the `/path/to/hydra/dist/ngHydra` folder, then you can use `bettercap` (make sure it's updated) for both the REST API and to serve the web ui itself via the `http.server` module:

```sh
sudo bettercap -iface wlan1 -eval "wifi.recon on; ble.recon on; hid.recon on; set api.rest.username user; set api.rest.password pass; api.rest on; set http.server.path /path/to/hydra/dist/ngHydra; http.server on"
```

And login with `user` and `pass`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

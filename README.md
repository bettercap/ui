<p align="center">
  <img alt="Hydra" src="https://github.com/guizzo/hydra/blob/master/src/assets/images/logo.png" height="140" />
  <p align="center">
    <a href="https://github.com/bettercap/bettercap/blob/master/LICENSE.md"><img alt="Software License" src="https://img.shields.io/badge/license-GPL3-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

# Hydra

Hydra is a UI crafted on top of [bettercap](https://www.bettercap.org/), **this project is still work in progress**. 

## Prerequisites

What things you need to install the software and how to install them

- Node
- NPM (come with Node installer)

## Getting Started

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

## License

Hydra is made with ♥  by [the dev team](https://github.com/guizzo/hydra/graphs/contributors) and it's released under the GPL 3 license.

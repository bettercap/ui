<p align="center">
  <img alt="Hydra" src="https://github.com/bettercap/hydra/blob/master/src/assets/images/logo.png" height="140" />
  <p align="center">
    <a href="https://github.com/bettercap/bettercap/blob/master/LICENSE.md"><img alt="Software License" src="https://img.shields.io/badge/license-GPL3-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

# Hydra

Hydra is a UI crafted on top of [bettercap](https://www.bettercap.org/), **this project is still work in progress**. 

## Prerequisites

What things you need to install the software and how to install them

- Node
- NPM

## Getting Started

In order to run the web ui, first clone the repo somewhere and build the source:

```sh
git clone https://github.com/bettercap/hydra.git ~/hydra
cd ~/hydra
npm install --save
npm run build
```

This shoud generate the `~/dist/hydra` folder, then you can use `bettercap` (make sure it's updated) for both the REST API and to serve the web ui itself via the `http.server` module:

```sh
sudo bettercap
```

Then from bettercap's interactive session, enable a few modules:

```
wifi.recon on 
ble.recon on
hid.recon on
```

Setup the `api.rest` module (change these default credentials!):

```
set api.rest.username changeme 
set api.rest.password changeme 
api.rest on
```

And start serving the UI (by default on port 80 of the IP address of the interface):

```
set http.server.address 127.0.0.1
set http.server.path /path/to/hydra/dist/hydra 
http.server on
```

The UI will be available at `http://127.0.0.1/`, you can login with the credentials provided to `api.rest`.

For further information, [refer to bettercap's documentation](https://www.bettercap.org/).

## License

Hydra is made with ♥  by [the dev team](https://github.com/bettercap/hydra/graphs/contributors) and it's released under the GPL 3 license.

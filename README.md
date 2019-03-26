<p align="center">
  <img alt="bettercap" src="https://github.com/bettercap/ui/blob/master/src/assets/images/logo.png" height="140" />
  <p align="center">
    <a href="https://github.com/bettercap/ui/releases/latest"><img alt="Release" src="https://img.shields.io/github/release/bettercap/ui.svg?style=flat-square"></a>
    <a href="https://github.com/bettercap/bettercap/blob/master/LICENSE.md"><img alt="Software License" src="https://img.shields.io/badge/license-GPL3-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

This is the official [bettercap](https://www.bettercap.org/)'s web UI.

## Installation

Download the latest [ui.zip precompiled release](https://github.com/bettercap/ui/releases) and unzip it to `/usr/local/share/bettercap/ui`:

```sh
wget https://github.com/bettercap/ui/releases/download/VERSION/ui.zip
sudo mkdir -p /usr/local/share/bettercap
sudo unzip ui.zip -d /usr/local/share/bettercap/
```

Make sure you have the [latest version of bettercap](https://github.com/bettercap/bettercap/releases) and update your [caplets](https://github.com/bettercap/caplets):

```sh
sudo bettercap -eval "update.check on; caplets.update; q"
```

Edit the access credentials in `/usr/local/share/bettercap/caplets/http-ui.cap` and start the `http-ui` caplet (you can instead use the `https-ui` caplet to use SSL, in which case you'll need to import bettercap's self signed certificate or use a certificate that your browser will accept): 

```sh
sudo bettercap -caplet http-ui -autostart ""
```

The web ui will be available at `http://127.0.0.1/`.

For further information, [refer to bettercap's documentation](https://www.bettercap.org/).

## Building from Sources

Assuming you have `make`, `node` and `npm` correctly installed, first clone the repo somewhere, build the source and install to `/usr/local/share/bettercap/ui`:

```sh
git clone https://github.com/bettercap/ui.git ~/ui
cd ~/ui
make build
sudo make install
```

## License

This UI is made with ♥  by [the dev team](https://github.com/bettercap/ui/graphs/contributors) and it's released under the GPL 3 license.

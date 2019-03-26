<p align="center">
  <img alt="bettercap" src="https://github.com/bettercap/ui/blob/master/src/assets/images/logo.png" height="140" />
  <p align="center">
    <a href="https://github.com/bettercap/bettercap/blob/master/LICENSE.md"><img alt="Software License" src="https://img.shields.io/badge/license-GPL3-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

# ui

This is the official [bettercap](https://www.bettercap.org/)'s web UI, **this project is still work in progress**. 

## Building from Sources

Assuming you have `make`, `node` and `npm` correctly installed, first clone the repo somewhere, build the source and install to `/usr/local/share/bettercap/ui`:

```sh
git clone https://github.com/bettercap/ui.git ~/ui
cd ~/ui
make build
sudo make install
```

Make sure you have the [latest version of bettercap](https://github.com/bettercap/bettercap/releases) and update your [caplets](https://github.com/bettercap/caplets):

```sh
sudo bettercap -eval "caplets.update; q"
```

Edit the access credentials in `/usr/local/share/bettercap/caplets/http-ui.cap` and start the `http-ui` caplet: 

```sh
sudo bettercap -caplet http-ui -autostart ""
```

The web ui will be available at `http://127.0.0.1/`.

For further information, [refer to bettercap's documentation](https://www.bettercap.org/).

## License

This UI is made with ♥  by [the dev team](https://github.com/bettercap/ui/graphs/contributors) and it's released under the GPL 3 license.

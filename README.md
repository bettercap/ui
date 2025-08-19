<p align="center">
  <img alt="bettercap" src="https://github.com/bettercap/ui/blob/master/src/assets/images/logo.png" height="140" />
  <p align="center">
    <a href="https://github.com/bettercap/ui/releases/latest"><img alt="Release" src="https://img.shields.io/github/release/bettercap/ui.svg?style=flat-square"></a>
    <a href="https://github.com/bettercap/bettercap/blob/master/LICENSE.md"><img alt="Software License" src="https://img.shields.io/badge/license-GPL3-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

This is the official [bettercap](https://www.bettercap.org/)'s web UI.

## Installation

Refer to [bettercap's documentation](https://www.bettercap.org/usage/#web-ui).

## Building from Sources

Assuming you have `make`, `node` and `npm` correctly installed, first clone the repo somewhere, build the source and install to `/usr/local/share/bettercap/ui`:

```sh
git clone https://github.com/bettercap/ui.git ~/ui
cd ~/ui
make deps
make build
sudo make install
```

## License

This UI is made with ♥  by [the dev team](https://github.com/bettercap/ui/graphs/contributors) and it's released under the GPL 3 license.

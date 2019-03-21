"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1920,
        height: 1080,
        icon: "file://" + __dirname + "/../src/assets/images/logo.png",
        autoHideMenuBar: true,
        // https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined
        webPreferences: { nodeIntegration: false }
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/hydra/index.html"),
        protocol: "file:",
        slashes: true
    }));
    win.on("closed", function () {
        win = null;
    });
}
var win;
electron_1.app.on("ready", createWindow);
electron_1.app.on("activate", function () {
    if (win === null) {
        createWindow();
    }
});
electron_1.app.on('window-all-closed', function () {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map
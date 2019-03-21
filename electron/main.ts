import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";
let win: BrowserWindow;

function createWindow() {
    win = new BrowserWindow({ 
        width: 1920, 
        height: 1080,
        icon: `file://${__dirname}/../src/assets/images/logo.png`,
        autoHideMenuBar: true,
        // https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined
        webPreferences: { nodeIntegration: false }
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/../../dist/hydra/index.html`),
            protocol: "file:",
            slashes: true
        })
    );

    if( process.argv.includes('--dev-tools') ) {
        win.webContents.openDevTools({
            mode: 'detach'
        });
    }

    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});

app.on('window-all-closed', function () {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const client = require("electron-connect").client;
const path = require("path");
const url = require("url");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ "width" : 1400, "height" : 800 });
    mainWindow.loadURL(url.format({
        "pathname" : path.join(__dirname, "/build/html/index.html"),
        "protocol" : "file:",
        "slashes" : true
    }));
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", function () {
        mainWindow = null
    });
    client.create(mainWindow);
}

app.on("ready", createWindow)

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit()
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});

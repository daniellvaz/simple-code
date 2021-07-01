const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    heigth: 600,
    frame: false,
  });

  win.loadURL("http://localhost:5500");
}

app.whenReady().then(() => createWindow());

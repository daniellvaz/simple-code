import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from 'electron';
// import { screen } from '../settings/settings.json';

const alwaysOnTop = (window: BrowserWindow) => {
  if(!window.isAlwaysOnTop()) {
    window.setAlwaysOnTop(true);
    return
  }

  window.setAlwaysOnTop(false);

  ipcMain.emit('action', 'teste')
}

const navBarActions = (action: string, window: BrowserWindow) => {
  switch(action){
    case 'close':
      window.close();
      return
    case 'minimize':
      window.isMinimized() ? window.restore() : window.minimize(); 
      return
    case 'maximize':
      window.isMaximized() ? window.restore() : window.maximize();
    break;
  }
}

const openFileToRender = async () => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "All Files", extensions: ["*"] }],
  });

  const file = filePaths[0];

  if(!file) {
    return
  }

  const win = new BrowserWindow();
  win.loadFile(file);
};


// create the initial page
function createWindow() {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'src/view/assets/icon.png',
    title: 'Simple Code',
    movable: true,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("src/view/index.html");
  win.webContents.toggleDevTools();

  ipcMain.on('action', (e, arg) => {
    navBarActions(arg, win)
  });


  const menu = new Menu();

  menu.append(
    new MenuItem({
      label: "Open",
      submenu: [
        {
          label: 'Open File',
          accelerator: process.platform === "darwin" ? "Shift+O" : "Shift+O",
          click: () => openFileToRender(),
        },
        {
          label: 'Always on top',
          accelerator: process.platform === "darwin" ? "Shift+T" : "Shift+T",
          click: () => alwaysOnTop(win),
        },
        {
          label: 'Reload',
          accelerator: process.platform === "darwin" ? "Shift+R" : "Shift+R",
          click: () => win.reload(),
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);
}



app.on("ready", createWindow);
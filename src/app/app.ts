import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from 'electron';

// Opend Developer DevTools
const openDevTools = (window: BrowserWindow) => {
  if(!window.webContents.isDevToolsOpened()) { 
    window.webContents.openDevTools({mode: 'bottom'});
    return
  }
  window.webContents.closeDevTools();
}
// Open inital page
const openInitialPage = (window: BrowserWindow) => {
  window.loadFile('src/view/index.html');
}

// Alwais on top function
const alwaysOnTop = (window: BrowserWindow) => {
  if(!window.isAlwaysOnTop()) {
    window.setAlwaysOnTop(true);
    return
  }

  window.setAlwaysOnTop(false);

  ipcMain.emit('action', 'teste')
}

// open file
const openFileToRender = async (window: BrowserWindow) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "All Files", extensions: ["*"] }],
  });

  const file = filePaths[0];

  if(!file) {
    return
  }
};

//navbar actions 
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
    case 'open':
      openFileToRender(window);
      return
    case 'open-live-server':
      window.loadURL('http://127.0.0.1:5500');
    break;
  }
}

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
          click: () => openFileToRender(win),
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
        {
          label: 'Open DevTools',
          accelerator: process.platform === "darwin" ? "Shift+D" : "Shift+D",
          click: () => openDevTools(win),
        },
        {
          label: 'Open initial page',
          accelerator: process.platform === "darwin" ? "Shift+F" : "Shift+F",
          click: () => openInitialPage(win),
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);
}



app.on("ready", createWindow);
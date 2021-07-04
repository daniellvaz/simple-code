"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// import { screen } from '../settings/settings.json';
var alwaysOnTop = function (window) {
    if (!window.isAlwaysOnTop()) {
        window.setAlwaysOnTop(true);
        return;
    }
    window.setAlwaysOnTop(false);
    electron_1.ipcMain.emit('action', 'teste');
};
var navBarActions = function (action, window) {
    switch (action) {
        case 'close':
            window.close();
            return;
        case 'minimize':
            window.isMinimized() ? window.restore() : window.minimize();
            return;
        case 'maximize':
            window.isMaximized() ? window.restore() : window.maximize();
            break;
    }
};
var openFileToRender = function () { return __awaiter(void 0, void 0, void 0, function () {
    var filePaths, file, win;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog({
                    properties: ["openFile"],
                    filters: [{ name: "All Files", extensions: ["*"] }],
                })];
            case 1:
                filePaths = (_a.sent()).filePaths;
                file = filePaths[0];
                if (!file) {
                    return [2 /*return*/];
                }
                win = new electron_1.BrowserWindow();
                win.loadFile(file);
                return [2 /*return*/];
        }
    });
}); };
// create the initial page
function createWindow() {
    var win = new electron_1.BrowserWindow({
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
    electron_1.ipcMain.on('action', function (e, arg) {
        navBarActions(arg, win);
    });
    var menu = new electron_1.Menu();
    menu.append(new electron_1.MenuItem({
        label: "Open",
        submenu: [
            {
                label: 'Open File',
                accelerator: process.platform === "darwin" ? "Shift+O" : "Shift+O",
                click: function () { return openFileToRender(); },
            },
            {
                label: 'Always on top',
                accelerator: process.platform === "darwin" ? "Shift+T" : "Shift+T",
                click: function () { return alwaysOnTop(win); },
            },
            {
                label: 'Reload',
                accelerator: process.platform === "darwin" ? "Shift+R" : "Shift+R",
                click: function () { return win.reload(); },
            },
        ],
    }));
    electron_1.Menu.setApplicationMenu(menu);
}
electron_1.app.on("ready", createWindow);

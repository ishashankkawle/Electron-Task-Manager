const {app, BrowserWindow} = require('electron');
const ipc = require('electron').ipcMain;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({ width: 2000, height: 2000 })
    win.webContents.openDevTools()

    // and load the index.html of the app.
    win.loadFile('index.html')
  }
  
  app.on('ready', createWindow)

  ipc.on('close-app' , function(event){
    app.quit();
  })
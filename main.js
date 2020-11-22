const { app, BrowserWindow, Menu } = require('electron');
const ipc = require('electron').ipcMain;
let url = require('url');
const path = require('path')


function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ show: true, frame: true, width: 2000, height: 2000, webPreferences: { nodeIntegration: true } })

  // and load the index.html of the app.
  win.loadFile('index.html')

  //MENU
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

function createTaskWindow(args) 
{
  let secondWindow = new BrowserWindow({show: true, width: 800, height: 600 , webPreferences: { nodeIntegration: true }});
  secondWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/views/taskDetailsIndex.html'),
    protocol: 'file:',
    slashes: true
  }))
  secondWindow.webContents.send('transfer-taskid', args);

  //MENU
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}



app.on('ready', createWindow)
//app.on('ready', createTaskWindow)

ipc.on('close-app', (event) => {
  app.quit();
});

ipc.on('open-task', (event, args) => {
  createTaskWindow(args);
});

//-----------------------------------------------------------------------
// REMOVE AFTER DONE
//-----------------------------------------------------------------------
const mainMenuTemplate = [
  {
    label: 'DeveloperTool',
    submenu: [
      {
        label: 'Toggle DevTools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  }
]
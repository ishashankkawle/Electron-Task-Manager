const {app, BrowserWindow, Menu} = require('electron');
const ipc = require('electron').ipcMain;


function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({ show:true, frame:false, width: 2000, height: 2000 })

    // and load the index.html of the app.
    win.loadFile('index.html')

    //MENU
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
  }


  
  app.on('ready', createWindow)

  ipc.on('close-app' , function(event){
    app.quit();
  })

  //-----------------------------------------------------------------------
  // REMOVE AFTER DONE
  //-----------------------------------------------------------------------
  const mainMenuTemplate = [
    {
      label: 'DeveloperTool',
      submenu: [
        {
          label:'Toggle DevTools',
          click(item, focusedWindow)
          {
            focusedWindow.toggleDevTools();
          }
        }
      ]
    }
  ]
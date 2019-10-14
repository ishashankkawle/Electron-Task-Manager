const ipc = require('electron').ipcRenderer;
const UIList = [ 'TaskPanel' , 'LogsPanel' , 'AboutPanel' ];

function loadUI(screenName)
{
    document.getElementById(screenName).style.display = 'flex';
    closeOtherUIWindows(screenName);
}

function closeWindow()
{
    ipc.send('close-app');
}

function closeOtherUIWindows(ViewName)
{
    for (let index = 0; index < UIList.length; index++) 
    {
        if(ViewName !== UIList[index])
        {
            document.getElementById(UIList[index]).style.display = 'none';
        }
    }   
}
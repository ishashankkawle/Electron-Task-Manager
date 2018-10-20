const ipc = require('electron').ipcRenderer;
const UIList = [ 'TaskPanel' , 'LogsPanel' , 'AboutPanel' ];

function loadTaskUI()
{
    var screenName = UIList[0];
    document.getElementById(screenName).style.display = 'flex';
    closeOtherUIWindows(screenName);
}

function loadLogsUI()
{
    var screenName = UIList[1];
    document.getElementById(screenName).style.display = 'flex';
    closeOtherUIWindows(screenName);
}

function loadAboutUI()
{
    var screenName = UIList[2];
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
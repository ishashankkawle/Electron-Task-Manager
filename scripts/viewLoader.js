const ipc = require('electron').ipcRenderer;
const UIList = [ 'TaskPanel' , 'LogsPanel' , 'AboutPanel' ];

function loadLandingPage()
{
    loadUIElement('views/overview');
}

function closeWindow()
{
    ipc.send('close-app');
}

function loadUIElement(screenName)
{
    document.getElementById('display').innerHTML = 'none';

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET' , screenName + '.html');
    xmlhttp.onreadystatechange = function(){
        if(this.readyState !== 4) return;
        if(this.status !== 200) return;
        document.getElementById('display').innerHTML = this.responseText;
    }
    xmlhttp.send();
}
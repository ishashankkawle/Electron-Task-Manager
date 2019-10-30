const ipc = require('electron').ipcRenderer;

function loadLandingPage()
{
    loadUIElement('display' , 'views/overview');
}

function closeWindow()
{
    ipc.send('close-app');
}

function loadUIElement( locationId , screenName)
{
    document.getElementById(locationId).innerHTML = "<img src='resources/loadbar.gif' width=200px height=200px />";

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET' , screenName + '.html');
    xmlhttp.onreadystatechange = function(){
        if(this.readyState !== 4) return;
        if(this.status !== 200) return;
        document.getElementById(locationId).innerHTML = this.responseText;
    }
    
    xmlhttp.send();
}

function toggleDisplayElements(elementId1 , elementId2)
{
    toggleDisplayElement(elementId1);
    toggleDisplayElement(elementId2);
}

function toggleDisplayElement(elementId)
{
    let displayValue = document.getElementById(elementId).style.display;
    if(displayValue == "none")
    {
        toggleDisplayElementOn(elementId)
    }
    else
    {
        toggleDisplayElementOff(elementId)
    }
}

function toggleDisplayElementOn(elementId)
{
    document.getElementById(elementId).style.display = "flex"
}


function toggleDisplayElementOff(elementId)
{
    document.getElementById(elementId).style.display = "none"
}
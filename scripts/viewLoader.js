const ipc = require('electron').ipcRenderer;

function loadLandingPage()
{
    loadUIElement('display' , 'views/overview' , 'Overview');
}

function closeWindow()
{
    ipc.send('close-app');
}

function loadUIElement( locationId , screenName , path)
{
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET' , screenName + '.html');
    xmlhttp.onreadystatechange = function(){
        if(this.readyState !== 4) return;
        if(this.status !== 200) return;
        document.getElementById(locationId).innerHTML = this.responseText;
    }
    
    xmlhttp.send();

    if(screenName == 'views/overview' )
    {
        operationTrigger('base_getAllOverviewData');
    }

    if(screenName == 'views/taskboard' )
    {
        operationTrigger('base_getAllTaskData');
    }

    if(path != undefined)
    {
        document.getElementById("path-name").innerText = path;
    }
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

function loadMask(status , secondaryText)
{
    if(status == 1)
    {   
        if(secondaryText !== undefined)
        {
            if(document.getElementById("loader-box").children[1].children[2] == undefined)
            {
                var secText = document.createElement('span')
                secText.style.fontSize = "12px";
                secText.innerText = secondaryText
                document.getElementById("loader-box").children[1].appendChild(secText);
            }
            else
            {
                document.getElementById("loader-box").children[1].children[2].innerText = secondaryText;
            }
        }
        else
        {
            if(document.getElementById("loader-box").children[1].children[2] !== undefined)
            {
                document.getElementById("loader-box").children[1].children[2].innerHTML = '';
            }
        }
        document.getElementById("loader-box").style.display = "contents";
    }
    else
    {
        document.getElementById("loader-box").style.display = "none";
    }
}
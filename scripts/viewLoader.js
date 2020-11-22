const { ipcRenderer } = require('electron');

function loadLandingPage() {
    toggleDisplayElement('main-nav');
    loadUIElement('display', 'views/login', 'Login');
}

function loadTaskDetailsPage()
{
    loadUIElement('task-display', 'taskDetailsPages/taskDetails');
}

function validateLogin() {
    toggleDisplayElement('main-nav');
    loadUIElement('display', 'views/overview', 'Overview');
}

function closeWindow() {
    ipcRenderer.send('close-app');
}

async function loadUIElement(locationId, screenName, path) {
    let responseData = await fetch(screenName + '.html');
    if (responseData.status === 200) {
        let data = await responseData.text();
        document.getElementById(locationId).innerHTML = data;
    }

    if (screenName == 'views/overview') {
        operationTrigger('base_getAllOverviewData');
    }

    if (screenName == 'views/taskboard') {
        operationTrigger('base_getAllTaskData');
    }

    if (screenName == 'views/taskVerificationPages/verificationView') {
        operationTrigger('base_getAllVerificationData');
    }

    if (screenName == 'views/taskVerificationPages/assignmentsView') {
        operationTrigger('base_getAllAssignmentData');
    }

    if (screenName == 'views/admin') {
        //@TODO
        //Apply Security on Verticle NavBar to remove Project , User Create , Asset Create Buttons
    }

    if (screenName == 'views/adminPages/projectView') {
        operationTrigger('admin_getAllProjectData');
    }

    if (screenName == 'views/adminPages/userAssignmentView') {
        operationTrigger('admin_getUserAssignmentSource');
    }

    if (screenName == 'views/adminPages/taskView') {
        operationTrigger('admin_getProjectUserListForTask');
    }

    if (screenName == 'views/adminPages/userView') {
        operationTrigger('admin_getProjectListForUser');
    }

    if (screenName == 'views/adminPages/assetView') {
        operationTrigger('admin_getProjectListForAssets');
    }

    if (path != undefined) {
        document.getElementById("path-name").innerText = path;
    }
}

function toggleDisplayElements(elementId1, elementId2) {
    toggleDisplayElement(elementId1);
    toggleDisplayElement(elementId2);
}

function toggleDisplayElement(elementId) {
    let displayValue = document.getElementById(elementId).style.display;
    if (displayValue == "none") {
        toggleDisplayElementOn(elementId)
    }
    else {
        toggleDisplayElementOff(elementId)
    }
}

function toggleDisplayElementOn(elementId) {
    document.getElementById(elementId).style.display = "flex"
}

function toggleDisplayElementOff(elementId) {
    document.getElementById(elementId).style.display = "none"
}

function loadMask(status, secondaryText) {
    if (status == 1) {
        if (secondaryText !== undefined) {
            if (document.getElementById("loader-box").children[1].children[2] == undefined) {
                var secText = document.createElement('span')
                secText.style.fontSize = "12px";
                secText.innerText = secondaryText
                document.getElementById("loader-box").children[1].appendChild(secText);
            }
            else {
                document.getElementById("loader-box").children[1].children[2].innerText = secondaryText;
            }
        }
        else {
            if (document.getElementById("loader-box").children[1].children[2] !== undefined) {
                document.getElementById("loader-box").children[1].children[2].innerHTML = '';
            }
        }
        document.getElementById("loader-box").style.display = "contents";
    }
    else {
        document.getElementById("loader-box").style.display = "none";
    }
}

function openTaskDetails()
{
    let data = "249";
    ipcRenderer.send('open-task' , data);
}

const { ipcRenderer } = require('electron')
let isDark = false

function loadLandingPage() {
  toggleDisplayElement('main-nav')
  loadUIElement('display', 'views/login', 'Login')
}

function loadTaskDetailsPage(callback) {
  loadUIElement('task-display', 'taskDetailsPages/taskDetails')

  ipcRenderer.on('transfer-taskid',  (event , arg) =>{
      operationTrigger_TaskDetails("base_getAllSelectedTaskData" , arg)
  });
}

function validateLogin() {
  toggleDisplayElement('main-nav')
  loadUIElement('display', 'views/overview', 'Overview')
}

function closeWindow() {
  let al = confirm('Do you wish to stop the application ?')
  if (al) ipcRenderer.send('close-app')
}

function toggleTheme() {
  isDark = !isDark
  if (!isDark) {
    document.documentElement.style.setProperty(`--text`, '#334d6e')
    document.documentElement.style.setProperty(`--accent`, '#2196f3')
    document.documentElement.style.setProperty(`--bg`, '#edf1f7')
    document.documentElement.style.setProperty(`--bg2`, '#ffffff')
    document.documentElement.style.setProperty(`--bg3`, '#f8f9fa')
    document.documentElement.style.setProperty(`--bc`, '#dee2e6')
    document.getElementById('theme-icon').innerText = 'brightness_2'
  } else {
    document.documentElement.style.setProperty(`--text`, '#ffffffcc')
    document.documentElement.style.setProperty(`--accent`, '#f3c669')
    document.documentElement.style.setProperty(`--bg`, '#141b2d')
    document.documentElement.style.setProperty(`--bg2`, '#1f2940')
    document.documentElement.style.setProperty(`--bg3`, '#192038')
    document.documentElement.style.setProperty(`--bc`, '#141b2d')
    document.getElementById('theme-icon').innerText = 'wb_sunny'
  }
}

async function loadUIElement(locationId, screenName, path) {
  let responseData = await fetch(screenName + '.html')
  if (responseData.status === 200) {
    let data = await responseData.text()
    document.getElementById(locationId).innerHTML = data
  }

  if (screenName == 'views/overview') {
    operationTrigger('base_getAllOverviewData')
  }

  if (screenName == 'views/taskboard') {
    operationTrigger('base_getAllTaskData')
  }

  if (screenName == 'views/taskVerificationPages/verificationView') {
    operationTrigger('base_getAllVerificationData')
  }

  if (screenName == 'views/taskVerificationPages/assignmentsView') {
    operationTrigger('base_getAllAssignmentData')
  }

  if (screenName == 'views/admin') {
    //@TODO
    //Apply Security on Verticle NavBar to remove Project , User Create , Asset Create Buttons
  }

  if (screenName == 'views/adminPages/projectView') {
    operationTrigger('admin_getAllProjectData')
  }

  if (screenName == 'views/adminPages/userAssignmentView') {
    operationTrigger('admin_getUserAssignmentSource')
  }

  if (screenName == 'views/adminPages/taskView') {
    operationTrigger('admin_getProjectListForTask')
  }

  if (screenName == 'views/adminPages/userView') {
    operationTrigger('admin_getProjectListForUser')
  }

  if (screenName == 'views/adminPages/assetView') {
    operationTrigger('admin_getProjectListForAssets')
  }

  if (screenName == 'views/adminPages/roleView') {
    operationTrigger('admin_getRoleList')
  }

  if (screenName == 'views/adminPages/roleAssignmentView') {
    operationTrigger('admin_roleAssigmentSource')
  }

  if (path != undefined) {
    document.getElementById('path-name').innerText = path
  }
}

function toggleDisplayElements(elementId1, elementId2) {
  toggleDisplayElement(elementId1)
  toggleDisplayElement(elementId2)
}

function toggleDisplayElement(elementId) {
  let displayValue = document.getElementById(elementId).style.display
  if (displayValue == 'none') {
    toggleDisplayElementOn(elementId)
  } else {
    toggleDisplayElementOff(elementId)
  }
}

function toggleDisplayElementOn(elementId) {
  document.getElementById(elementId).style.display = 'flex'
}

function toggleDisplayElementOff(elementId) {
  document.getElementById(elementId).style.display = 'none'
}

function loadMask(status, secondaryText) {
  if (status == 1) {
    if (secondaryText !== undefined) {
      if (document.getElementById('loader-box').children[1].children[2] == undefined) {
        var secText = document.createElement('span')
        secText.style.fontSize = '12px'
        secText.innerText = secondaryText
        document.getElementById('loader-box').children[1].appendChild(secText)
      } else {
        document.getElementById('loader-box').children[1].children[2].innerText = secondaryText
      }
    } else {
      if (document.getElementById('loader-box').children[1].children[2] !== undefined) {
        document.getElementById('loader-box').children[1].children[2].innerHTML = ''
      }
    }
    document.getElementById('loader-box').style.display = 'contents'
  } else {
    document.getElementById('loader-box').style.display = 'none'
  }
}

function openTaskDetails(data) {
  ipcRenderer.send('open-task', data)
}

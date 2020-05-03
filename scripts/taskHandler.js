let XL = require('././core/exlHandler');
let Util = require('././core/util');
let fs = require('fs');
let res = require('././shared/resources');
let Admin = require('././scripts/adminManager');
let TaskM = require('././scripts/taskManager');
let Ove_ViewLdr = require('././scripts/Overview_ViewLoader');


const util = new Util();
const admin = new Admin();
const taskm = new TaskM();
const ovl = new Ove_ViewLdr();

async function operationTrigger(params) 
{
    switch (params) 
    {
        case "admin_createTask":
            admin.saveTask(params);
            break;

        case "admin_createUser":
            admin.saveUser(params);
            break;
        
        case "admin_createModule":
            admin.saveModule(params);
            break;

        case "admin_createType":
            admin.saveType(params);
            break;
        
        case "admin_createPriority":
            admin.savePriority(params);
            break;

        case "home_getData":
            loadMask(1 , "fetching data");
            let data = await taskm.getHomeScreenData();
            let element = document.getElementById("task-panel");
            let element_list = document.getElementById("task-list");
            loadMask(0);
            ovl.parseHomeScreenObject(data , element , element_list);
            break; 

        default:
            break;
    }    
}

// async function InsertTaskInExcel(arrTask, xlWorkbook)
// {
//     let exist = await util.checkFileExist(res["FILE_PATH"], res["FILE_NAME"]);
//     if (!exist) {
//         xlWorkbook = exl.getNewWorkBook();
//     }
//     else {
//         xlWorkbook = await exl.openWorkBook();
//     }


//     let xlFilePath = res["FILE_PATH"] + res["FILE_NAME"];
//     let xl = new XL();
//     let xlSheet = xl.getWorksheetFromWorkbook(xlWorkbook, res["SHEET_NAME"]);
//     if (xlSheet == undefined) {
//         xlSheet = xl.getNewWorkSheet();
//     }
//     xlSheet = xl.AddDataToSheet(xlSheet, arrTask);
//     xlWorkbook = xl.AddSheet(xlWorkbook, xlSheet, 'TASKS');
//     xl.WriteXL(xlWorkbook, xlFilePath);
// }

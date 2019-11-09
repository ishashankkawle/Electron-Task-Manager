let XL = require('././core/exlHandler');
let Util = require('././core/util');
let fs = require('fs');
let res = require('././shared/resources');
let Admin = require('././scripts/adminManager')

const util = new Util();
const admin = new Admin();

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
        default:
            break;
    }    
}

// async function saveTask() {
//     try {
//         let data = [];
//         //const exl = new XL();
//         const dbOps = new dbOperations();

//         data.push(document.getElementById('Module').value);
//         data.push(document.getElementById('Title').value);
//         data.push(document.getElementById('Description').value);
//         data.push(document.getElementById('ETA').value);
//         data.push(document.getElementById('Owner').value);
//         data.push(document.getElementById('Assign').value);
//         data.push(document.getElementById('Type').value);
//         data.push(document.getElementById('Priority').value);
//         data.push(document.getElementById('Order').value);

//         //await InsertTaskInExcel(data, xlWorkbook);
//         await insertIntoDatabase(data, dbOps);
//         //await getDataFromDatabase(dbOps);
//     }
//     catch (error) {
//         console.log("Error due to : " + error);
//     }

// }

// async function insertIntoDatabase(arrData, dbOps) {
//     let db = dbOps.initialize(res["firebaseConfig"]);
//     let keys = ["Module", "Title", "Description", "ETA", "Owner", "Assign", "Type", "Priority", "Order"]
//     let objData = util.generateJSONObject(keys, arrData);
//     dbOps.insertData(objData, "Task", db);
// }

// async function getDataFromDatabase(dbOps) {
//     let db = dbOps.initialize(res["firebaseConfig"]);
//     console.log(dbOps.readAllData("Task", db));
// }

async function InsertTaskInExcel(arrTask, xlWorkbook)
{
    let exist = await util.checkFileExist(res["FILE_PATH"], res["FILE_NAME"]);
    if (!exist) {
        xlWorkbook = exl.getNewWorkBook();
    }
    else {
        xlWorkbook = await exl.openWorkBook();
    }


    let xlFilePath = res["FILE_PATH"] + res["FILE_NAME"];
    let xl = new XL();
    let xlSheet = xl.getWorksheetFromWorkbook(xlWorkbook, res["SHEET_NAME"]);
    if (xlSheet == undefined) {
        xlSheet = xl.getNewWorkSheet();
    }
    xlSheet = xl.AddDataToSheet(xlSheet, arrTask);
    xlWorkbook = xl.AddSheet(xlWorkbook, xlSheet, 'TASKS');
    xl.WriteXL(xlWorkbook, xlFilePath);
}

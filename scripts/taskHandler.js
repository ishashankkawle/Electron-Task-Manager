let XL = require('././scripts/exlHandler');
let Util = require('././scripts/util');
let fs = require('fs');
let res = require('././shared/resources');
const util = require('util');


let xlWorkbook;

async function saveTask() {
    try {
        let data = [];
        let dateTime = new Date();
        const exl = new XL();
        const util = new Util();
        let exist = await util.checkFileExist();
        if (!exist) {
            xlWorkbook = exl.getNewWorkBook();
        }
        else {
            xlWorkbook = await exl.openWorkBook();
        }

        data[0] = document.getElementById('module').value;
        data[1] = dateTime.getDate() + "/" + dateTime.getMonth() + "/" + dateTime.getFullYear();
        data[2] = document.getElementById('task').value;
        data[3] = document.getElementById('description').value;
        data[4] = document.getElementById('iob').value;
        await InsertTaskInExcel(data, xlWorkbook);
    }
    catch (error) {
        console.log("Error due to : " + error);
    }

}


async function InsertTaskInExcel(arrTask, xlWorkbook)
{
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

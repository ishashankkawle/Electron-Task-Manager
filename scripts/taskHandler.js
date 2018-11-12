let ExlJS = require('././scripts/exlHandler');
let fs = require('fs');
let res = require('././shared/resources');

let workbook;
let exelSheet;

async function saveTask() {
    const exl = new ExlJS();
    workbook = await checkFileExist(exl);
    console.log(res);
    exelSheet = await exl.openFile(workbook);
    console.log("Sheet = " + exelSheet);
}

async function checkFileExist(exl) 
{
    return new Promise( (resolve , reject) => {
        fs.access(res["FILE_PATH"] + res["FILE_NAME"], fs.constants.F_OK, (err) => {
            let obj;
            if (err == null) {
                obj = exl.createFile();
            }
            resolve(obj);
        });
    });
}
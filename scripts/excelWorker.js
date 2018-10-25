const res = require('././shared/resources');
const excel = require('exceljs');
const fs = require('fs');

let workbook;
function checkFileExist()
{
    fs.access(res["FILE_PATH"] + res["FILE_NAME"],fs.constants.F_OK, (err)=>{
        if(err !== null)
        {
            workbook = new excel.Workbook();
            var a = workbook.addWorksheet("TaskRecords");
            a.getCell('A1').value = "ASDF";
            workbook.xlsx.writeFile(res["FILE_PATH"] + res["FILE_NAME"]);
            console.log("File created");
        }
    });
}

function openFile()
{

}

function readAllData()
{
    
}
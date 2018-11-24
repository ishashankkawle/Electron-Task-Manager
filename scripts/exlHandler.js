const res = require('../shared/resources');
const util = require('util');
const XLSX = require('xlsx')

module.exports = class ExlJS 
{

    createWorkBook() 
    {
        let xlFilePath = res["FILE_PATH"] + res["FILE_NAME"];
        let xlWorkbook = XLSX.utils.book_new();
        let xlSheetName = res["SHEET_NAME"];
        let xlSheetHeaders = [[res["STR_MODULE"], res["STR_DATE"], res["STR_TASK"], res["STR_DESCRIPTION"], res["STR_IOB"]]];
        let xlWorkSheet = XLSX.utils.aoa_to_sheet(xlSheetHeaders);
        XLSX.utils.book_append_sheet(xlWorkbook, xlWorkSheet, xlSheetName);
        XLSX.writeFile(xlWorkbook, xlFilePath);
        return xlWorkbook;
    }

    openWorkBook() 
    {
        let xlFilePath = res["FILE_PATH"] + res["FILE_NAME"];
        let xlWorkbook = XLSX.readFile(xlFilePath);
        return xlWorkbook;
    }

    InsertTask(arrTask , xlWorkbook) 
    {
       let xlFilePath = res["FILE_PATH"] + res["FILE_NAME"];
       let xlSheet = xlWorkbook.Sheets[res["SHEET_NAME"]];
       xlSheet = XLSX.utils.sheet_add_aoa (xlSheet , [arrTask] , {origin : -1})
       console.log(xlSheet);
       XLSX.writeFile(xlWorkbook , xlFilePath);
       return xlWorkbook;
    }

}
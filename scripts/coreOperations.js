let xlHandler = require('./exlHandler');
const res = require('../shared/resources');


module.exports = class CoreOperations 
{
    InsertTaskInExcel(arrTask , xlWorkbook) 
    {
        let xlFilePath = res["FILE_PATH"] + res["FILE_NAME"];
        let xl = new xlHandler();
        let xlSheet = xl.getWorksheetFromWorkbook(xlWorkbook , res["SHEET_NAME"]);
        if(xlSheet == undefined)
        {
            xlSheet = xl.getNewWorkSheet();
        }
        xlSheet = xl.AddDataToSheet(xlSheet , arrTask);
        xlWorkbook = xl.AddSheet(xlWorkbook , xlSheet , 'TASKS');
        xl.WriteXL(xlWorkbook , xlFilePath);
    }
}
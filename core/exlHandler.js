const res = require('../shared/resources');
const XLSX = require('xlsx')

module.exports = class ExlJS 
{


    //let xlWorkbook = XLSX.utils.book_new();
    //let xlSheetHeaders = [[res["STR_MODULE"], res["STR_DATE"], res["STR_TASK"], res["STR_DESCRIPTION"], res["STR_IOB"]]];
    //let xlWorkSheet = XLSX.utils.aoa_to_sheet(xlSheetHeaders)
    //XLSX.utils.book_append_sheet(xlWorkbook, xlWorkSheet, xlSheetName);
    //XLSX.writeFile(xlWorkbook, xlFilePath);
    //return xlWorkbook;

    getNewWorkBook() {
        return XLSX.utils.book_new();
    }

    AddSheet(xlWorkbook, xlWorkSheet, xlSheetName) {
        XLSX.utils.book_append_sheet(xlWorkbook, xlWorkSheet, xlSheetName);
        return xlWorkbook;
    }

    getNewWorkSheet(arrData) {
        return XLSX.utils.aoa_to_sheet([arrData]);
    }

    getWorksheetFromWorkbook(xlWorkbook, xlSheetName) {
        return xlWorkbook.Sheets[xlSheetName]
    }

    AddDataToSheet(xlSheet, arrData) {
        return XLSX.utils.sheet_add_aoa(xlSheet, [arrData], { origin: -1 })
    }

    WriteXL(xlWorkbook, xlFilePath) {
        XLSX.writeFile(xlWorkbook, xlFilePath);
    }

    openWorkBook(FILE_PATH, FILE_NAME) {
        let xlFilePath = FILE_PATH + FILE_NAME;
        let xlWorkbook = XLSX.readFile(xlFilePath);
        return xlWorkbook;
    }

}
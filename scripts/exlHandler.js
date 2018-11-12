const res = require('../shared/resources');
const excel = require('exceljs');

// module.exports = {

//     createFile : function() {
//         workbook = new excel.Workbook();
//         workbook.creator = 'Laniak';
//         workbook.addWorksheet(res["SHEET_NAME"]);
//         return workbook
//     },
    
//     openFile : function() {
//         workbook = new excel.Workbook()
//         workbook.xlsx.readFile(res["FILE_PATH"] + res["FILE_NAME"]).then(function () {
//             exelSheet = workbook.getWorksheet(res["SHEET_NAME"]);
//             console.log(exelSheet);
//         })
//     }
// }

module.exports = class ExlJS{
    constructor()
    {
        this.workbook = "";
    }

    async createFile() {
        this.workbook = new excel.Workbook();
        this.workbook.creator = 'Laniak';
        this.workbook.addWorksheet(res["SHEET_NAME"]);
        this.workbook.xlsx.writeFile(res["FILE_PATH"] + res["FILE_NAME"]);
        console.log(this.workbook);
        return this.workbook;
    }
    
    openFile(workbook){
        return workbook.getWorksheet(res["SHEET_NAME"]);
    }
}
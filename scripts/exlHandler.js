const res = require('../shared/resources');
const excel = require('exceljs');
const util = require('util');

module.exports = class ExlJS{
    
    createFile() 
    {
        try 
        {
            let workbook = new excel.Workbook();
            workbook.creator = 'Laniak';
            workbook.addWorksheet(res["SHEET_NAME"]);
            workbook.getWorksheet(res["SHEET_NAME"]).columns = [
            {header:res["STR_MODULE"] , key:'module'},
            {header:res["STR_DATE"] , key:'date'},
            {heaade:res["STR_TASK"] , key:'task'},
            {header:res["STR_DESCRIPTION"] , key:'description'},
            {header:res["STR_IOB"] , key:'iob'}
            ]
            workbook.xlsx.writeFile(res["FILE_PATH"] + res["FILE_NAME"]);
            return workbook;    
        } 
        catch (error) 
        {
            console.log("Error due to : " + error);
        }
        
    }
    
    openWorkBook()
    {
        return new excel.Workbook();
    }

    getAllColumnData(columnKey, workbook)
    {
        try 
        {
            let dataList = []

            return new Promise( (resolve , reject) => {
                workbook.xlsx.readFile(res["FILE_PATH"] + res["FILE_NAME"])
                .then(function() 
                {
                    //let sheet = this.workbook.getWorksheet(res["SHEET_NAME"])
                    let column = exlSheet.getColumn(columnKey);
                    column.eachCell(function (cell , rowNumber)
                    {
                        dataList.push(cell.text);
                    });
                    resolve(dataList);
                });
            });
        } 
        catch (error)
        {
            console.log("Error due to : " + error);
            
        }
        
    }

    InsertTask(objTask)
    {
        let wbk = new excel.Workbook();
        console.log(res["SHEET_NAME"]);
        wbk.xlsx.readFile(res["FILE_PATH"] + res["FILE_NAME"])
        .then(function ()
        {
            console.log(wbk);
            //let workSheet = Workbook.getWorksheet(res["SHEET_NAME"]);
            //workSheet.addRows([objTask]);
            //console.log(workSheet);
        })
        //return Workbook.xlsx.writeFile(res["FILE_PATH"] + res["FILE_NAME"]);
    }

}
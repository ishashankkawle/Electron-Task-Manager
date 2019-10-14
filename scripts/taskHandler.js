let XL = require('././scripts/exlHandler');
let fs = require('fs');
let res = require('././shared/resources');
const util = require('util');
let operations = require('././scripts/coreOperations');


let xlWorkbook;

async function saveTask() 
{
    try 
    {
        let data = [];
        let dateTime = new Date();
        const exl = new XL();
        const op = new operations();
        let exist = await checkFileExist();
        if(!exist)
        {
            xlWorkbook = exl.getNewWorkBook();
        }
        else
        {
            xlWorkbook = await exl.openWorkBook();
        }

        data[0] = document.getElementById('module').value;
        data[1] = dateTime.getDate() + "/" + dateTime.getMonth() + "/" + dateTime.getFullYear();
        data[2] = document.getElementById('task').value;
        data[3] = document.getElementById('description').value;
        data[4] = document.getElementById('iob').value;
        await op.InsertTaskInExcel(data , xlWorkbook);
    } 
    catch (error) 
    {
        console.log("Error due to : " + error);
    }
    
}

async function checkFileExist() 
{
    try 
    {
        return new Promise( (resolve , reject) => {
            fs.access(res["FILE_PATH"] + res["FILE_NAME"], fs.constants.F_OK, (err) => {
                let obj = true;
                if (err != null) {
                    obj = false;
                }
                resolve(obj);
            });
        });
    } 
    catch (error) 
    {
        console.log("Error due to : " + error);
    }
    
}
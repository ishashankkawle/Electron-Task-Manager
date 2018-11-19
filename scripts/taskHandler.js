let ExlJS = require('././scripts/exlHandler');
let fs = require('fs');
let res = require('././shared/resources');
const util = require('util');


let workbook;
let exelSheet;

async function saveTask() 
{
    try 
    {
        let data = {};
        let dateTime = new Date();
        const exl = new ExlJS();
        let exist = await checkFileExist(exl);
        console.log(exist);
        if(!exist)
        {
            workbook = exl.createFile();
        }
        else
        {
            workbook = await exl.openWorkBook();
        }
        data[res["STR_MODULE"]] = document.getElementById('module').value;
        data[res["STR_DATE"]] = dateTime.getDate() + "/" + dateTime.getMonth() + "/" + dateTime.getFullYear();
        data[res["STR_TASK"]] = document.getElementById('task').value;
        data[res["STR_DESCRIPTION"]] = document.getElementById('description').value;
        data[res["STR_IOB"]] = document.getElementById('iob').value;
        let op = await exl.InsertTask(data);
        console.log(op);
    } 
    catch (error) 
    {
        console.log("Error due to : " + error);
    }
    
}

async function checkFileExist(exl) 
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
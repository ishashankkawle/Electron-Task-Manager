loadMask(1, "loading modues");
// let XL = require('././core/exlHandler');
let Util = require('././core/util');
// let fs = require('fs');
// let res = require('././shared/resources');
let Admin = require('././scripts/adminManager');
let TaskM = require('././scripts/taskManager');
let Ove_ViewLdr = require('././scripts/Overview_ViewLoader');
let AllTask_ViewLdr = require('././scripts/AllTask_ViewLoader');
let Adm_ViewLdr = require('././scripts/Admin_ViewLoader');

const util = new Util();
const admin = new Admin();
const taskm = new TaskM();
const ovl = new Ove_ViewLdr();
const atvl = new AllTask_ViewLdr();
const adm = new Adm_ViewLdr();
loadMask(0);

async function operationTrigger(...args) {
    if (args.length == 1) {
        operationSwitch(args[0]);
    }
    else {
        let len = args.length;
        operationSwitch(args[len - 1], args);
    }
}

async function operationSwitch(params, values) 
{
    switch (params) 
    {
        //---------------------------------------------------------------------
        // BASE OPERATIONS
        //---------------------------------------------------------------------
        case "base_getAllOverviewData":
            loadMask(1, "fetching data");
            let data = await taskm.getAllTaskData();
            let summaryData = await taskm.getTaskSummaryData();
            let element = document.getElementById("task-panel");
            let element_list = document.getElementById("task-list");
            let moduleTable = document.getElementById("module-frag-table").getElementsByTagName('tbody')[0];
            let summarySec = document.getElementById("summary-section");
            let perfChart = document.getElementById("performance-chart");
            let modOccupChart = document.getElementById("mod-occup-chart");
            ovl.parseTaskSectionObject(data, element, element_list);
            ovl.parseSummarySectionObject(summaryData, summarySec, moduleTable, perfChart, modOccupChart);
            loadMask(0);
            break;

        case "base_getAllTaskData":
            loadMask(1, "fetching data");
            let all_data = await taskm.getAllTaskData();
            all_data = all_data["rows"];
            let allTaskActiveTile = document.getElementById("all-tsk-summ-actv")
            let allTaskProgressTile = document.getElementById("all-tsk-summ-prgs")
            let allTaskCompleteTile = document.getElementById("all-tsk-summ-cmpl")
            loadMask(1, "populating ui view");
            let allTaskDataTable = document.getElementById("all-tsk-data-tbl").getElementsByTagName('tbody')[0];
            atvl.parseSummaryTaskData(all_data ,allTaskActiveTile , allTaskProgressTile, allTaskCompleteTile);
            atvl.parseTaskTableData(all_data ,allTaskDataTable);
            loadMask(0);
            break;

        //---------------------------------------------------------------------
        // OTHER OPERATIONS
        //---------------------------------------------------------------------
        case "admin_createTask":
            loadMask(1, 'creatig new task');
            admin.saveTask(params);
            loadMask(0);
            break;

        case "admin_createUser":
            loadMask(1, 'creating new user');
            admin.saveUser(params);
            loadMask(0);
            break;

        case "admin_createModule":
            loadMask(1, 'creating new module');
            admin.saveModule(params);
            loadMask(0);
            break;

        case "admin_createType":
            loadMask(1, 'creating new type');
            admin.saveType(params);
            loadMask(0);
            break;

        case "admin_createPriority":
            loadMask(1, 'creaating new priority');
            admin.savePriority(params);
            loadMask(0);
            break;

        case "update_task":
            loadMask(1, "performing operation");
            let id = values[0].substr(3, values[0].length - 1);
            let state = values[1];
            await taskm.updateTask(id, state);
            loadMask(0);
            break;

        case "delete_task":
            loadMask(1, "performing operation");
            let tid = values[0].substr(3, values[0].length - 1);
            await taskm.deleteTask(tid);
            loadMask(0);
            break;

        default:
            break;

    }
}

// async function InsertTaskInExcel(arrTask, xlWorkbook)
// {
//     let exist = await util.checkFileExist(res["FILE_PATH"], res["FILE_NAME"]);
//     if (!exist) {
//         xlWorkbook = exl.getNewWorkBook();
//     }
//     else {
//         xlWorkbook = await exl.openWorkBook();
//     }


//     let xlFilePath = res["FILE_PATH"] + res["FILE_NAME"];
//     let xl = new XL();
//     let xlSheet = xl.getWorksheetFromWorkbook(xlWorkbook, res["SHEET_NAME"]);
//     if (xlSheet == undefined) {
//         xlSheet = xl.getNewWorkSheet();
//     }
//     xlSheet = xl.AddDataToSheet(xlSheet, arrTask);
//     xlWorkbook = xl.AddSheet(xlWorkbook, xlSheet, 'TASKS');
//     xl.WriteXL(xlWorkbook, xlFilePath);
// }

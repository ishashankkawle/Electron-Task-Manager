loadMask(1, "loading modues");
let Util = require('././core/util');
let Admin = require('././scripts/adminManager');
let TaskM = require('././scripts/taskManager');
let Ove_ViewLdr = require('././scripts/Overview_ViewLoader');
let AllTask_ViewLdr = require('././scripts/AllTask_ViewLoader');
let Adm_ViewLdr = require('././scripts/Admin_ViewLoader');
let res = require('././shared/resources');


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

async function operationSwitch(params, values) {
    switch (params) {
        //---------------------------------------------------------------------
        // OVERVIEW OPERATIONS
        //---------------------------------------------------------------------
        case "base_getAllOverviewData":
            loadMask(1, "fetching data");
            //let data = await taskm.getAllTaskData();
            let data = await taskm.getAllTaskData();
            let summaryData = await taskm.getTaskSummaryData();
            let element = document.getElementById("task-panel");
            let element_list = document.getElementById("task-list");
            let moduleTable = document.getElementById("module-frag-table").getElementsByTagName('tbody')[0];
            let summarySec = document.getElementById("summary-section");
            let perfChart = document.getElementById("performance-chart");
            let modOccupChart = document.getElementById("mod-occup-chart");
            loadMask(1, "populating ui view");
            ovl.parseTaskSectionObject(data, element, element_list);
            ovl.parseSummarySectionObject(summaryData, summarySec, moduleTable, perfChart, modOccupChart);
            loadMask(0);
            break;

        case "base_getAllTaskData":
            loadMask(1, "fetching data");
            let all_data = await taskm.getAllTaskData();
            all_data = all_data["rows"];
            let allTaskNewTile = document.getElementById("all-tsk-summ-new")
            let allTaskCompleteTile = document.getElementById("all-tsk-summ-cmpl")
            let allTaskTotalTile = document.getElementById("all-tsk-summ-tot")
            let allTaskSelfCompleteTile = document.getElementById("all-tsk-slf-cmpl")
            let allTaskSelfDeleteTile = document.getElementById("all-tsk-slf-del")
            loadMask(1, "populating ui view");
            atvl.parseSummaryTaskData(all_data, allTaskNewTile, allTaskCompleteTile, allTaskTotalTile, allTaskSelfCompleteTile, allTaskSelfDeleteTile);
            atvl.loadDataOnTaskTable(all_data);
            loadMask(0);
            break;

        //---------------------------------------------------------------------
        // ADMIN OPERATIONS
        //---------------------------------------------------------------------
        case "admin_createProject":
            loadMask(1, 'creatig new project');
            admin.createProject(params);
            loadMask(0);
            break;

        case "admin_createUser":
            {
                loadMask(1, 'creatig new user');
                await admin.createUser(params);
                let email = document.getElementById('adm-Usr-Email').value;
                let projectId = document.getElementById('adm-Usr-Project').value;
                let userId = await admin.getUserId(email);
                admin.createUserAssignerMap(userId, res["STR_USERID"]);
                admin.createUserProjectMap(userId, projectId)
                loadMask(0);
                break;
            }

        case "admin_transferUser":
            {
                loadMask(1 , 'updating user mappings');
                let userToTransfer = document.getElementById('adm-UsrAsi-Source').value;
                let targetUser = document.getElementById('adm-UsrAsi-Target').value;
                admin.updateUserAssignerMap(userToTransfer , targetUser);
                let projectId = await admin.getProjectIdFromUser(targetUser);
                admin.updateUserProjectMap(userToTransfer , projectId);
                loadMask(0);
                break;
            }

        case "admin_createTask":
            loadMask(1, 'creatig new task');
            admin.saveTask(params);
            loadMask(0);
            break;

        case "admin_createAsset":
            loadMask(1, 'creating new Asset');
            let projectId = document.getElementById("adm-Ast-Project").value;
            let category = document.getElementById("adm-Ast-Category").value;
            let categoryName = document.getElementById("adm-Ast-CatName").value;
            switch (category) {
                case "Module":
                    console.log("IN MODULE SWITCH")
                    await admin.createModule(categoryName);
                    let moduleId = await admin.getModuleId(categoryName);
                    admin.createModuleProjectMap(moduleId, projectId);
                    break;
                case "Type":
                    await admin.createType(categoryName);
                    let typeId = await admin.getTypeId(categoryName);
                    admin.createTypeProjectMap(typeId, projectId);
                    break;
                case "Priority":
                    await admin.createPriority(categoryName);
                    let priorityId = await admin.getPriorityId(categoryName);
                    admin.createPriorityProjectMap(priorityId, projectId);
                    break;
            }
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

loadMask(1, "loading modules");

let TaskM = require('../scripts/taskManager');
let Admin = require('../scripts/adminManager');
let TaskDetails_ViewLdr = require('../scripts/taskDetails_viewLoader');


loadMask(1, "initializing modules");

const taskm = new TaskM();
const tdvl = new TaskDetails_ViewLdr();
const admin = new Admin();

loadMask(0);

async function operationTrigger_TaskDetails(...args) {
    if (args.length == 1) {
        operationSwitch_TaskDetails(args[0]);
    }
    else {
        operationSwitch_TaskDetails(args[0], args[1]);
    }
}

async function operationSwitch_TaskDetails(params, values) {
    switch (params) {
        case "base_getAllSelectedTaskData":
            {
                loadMask(1, 'Loading data');
                console.log(res["STR_USERID"] + "--" + values)
                //let data = await taskm.getSingleTaskData(values);
                //console.log(data)
                let data = await taskm.getTaskActivityData(values);
                console.log(data)
                let projectData = await admin.getProjectListForUser(res["STR_USERID"]);
                console.log(projectData)
                tdvl.parseTaskInfoSection(data[0].payload[0]);
                tdvl.parseTaskActivityData(data[1].payload.activity)
                tdvl.loadProjectDropdown(projectData);
                loadMask(0);
                break;
            }

        case "tskd_AddCommentInTask":
            {
                loadMask(1, 'Updating new activity in task');
                let taskId = document.getElementById("tskd-taskid").innerHTML;
                let data = document.getElementById("tskd-comment-input").value.replace(/\n/g, "<br>");
                let result = await taskm.UpdateNewComment(taskId, data)
                loadMask(0);
                break;
            }

        case "tskd_getModuleTypePriorityListForTask":
            {
                loadMask(1, 'getting Modules , Types & Priority for project');
                let projectId = document.getElementById("tskd-mod-project").value
                let moduleData = await admin.getModuleListForProject(projectId);
                let typeData = await admin.getTypeListForProject(projectId);
                let priorityData = await admin.getPriorityListForProject(projectId);
                let userData = await admin.getUserDetailsByFilter(res["STR_USERID"], projectId, "smaller_and_equal", "same");
                tdvl.checkForProjectUpdate(projectId);
                tdvl.loadModuleDropdown(moduleData);
                tdvl.loadTypeDropdown(typeData);
                tdvl.loadPriorityDropdown(priorityData);
                tdvl.loadUserDropdown(userData);
                loadMask(0);
                break;
            }
        case "tskd_checkModuleUpdate":
            {
                let module = document.getElementById("tskd-mod-module").value
                tdvl.checkForModuleUpdate(module);
                break;
            }
        case "tskd_checkTypeUpdate":
            {
                let type = document.getElementById("tskd-mod-type").value
                tdvl.checkForTypeUpdate(type);
                break;
            }
        case "tskd_checkPriorityUpdate":
            {
                let priority = document.getElementById("tskd-mod-priority").value
                tdvl.checkForPriorityUpdate(priority);
                break;
            }
        case "tskd_checkOwnerUpdate":
            {
                let owner = document.getElementById("tskd-mod-owner").value
                tdvl.checkForOwnerUpdate(owner);
                break;
            }
        case "tskd_UpdateTaskFields":
            {
                loadMask(1, 'updating task fields');
                let data = tdvl.getUpdatedFieldsData();
                await taskm.updateTaskFields(data);
                loadMask(0);
                break;
            }
        default:
            {
                break;
            }
    }
}
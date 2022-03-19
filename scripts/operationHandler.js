loadMask(1, "loading modules");

let Admin = require('././scripts/adminManager');
let TaskM = require('././scripts/taskManager');
let Ove_ViewLdr = require('././scripts/Overview_ViewLoader');
let AllTask_ViewLdr = require('././scripts/AllTask_ViewLoader');
let Admin_ViewLdr = require('././scripts/Admin_ViewLoader');
let TaskVerification_ViewLdr = require('././scripts/TaskVerification_ViewLoader');
const { ResumeToken } = require('mongodb');


loadMask(1, "initializing");

const admin = new Admin();
const taskm = new TaskM();
const ovl = new Ove_ViewLdr();
const atvl = new AllTask_ViewLdr();
const tskv = new TaskVerification_ViewLdr();
const advl = new Admin_ViewLdr();

loadMask(0);

async function operationTrigger(...args) {
    if (args.length == 1) {
        operationSwitch(args[0]);
    }
    else {
        operationSwitch(args[0], args[1]);
    }
}

async function operationSwitch(params, values) {
    switch (params) {
        //---------------------------------------------------------------------
        // OVERVIEW OPERATIONS
        //---------------------------------------------------------------------
        case "base_getAllOverviewData":
            {
                loadMask(1, "fetching data");
                let data = await taskm.getTasksForUser();
                let summaryData = await taskm.getTaskSummaryData(false);
                loadMask(1, "populating ui view");
                let element_list = document.getElementById("ovr-tsk-list");
                let summarySec = document.getElementById("summary-section");
                let perfChart = document.getElementById("performance-chart");
                let modOccupChart = document.getElementById("mod-occup-chart");
                ovl.parseTaskSectionObject(data, element_list);
                ovl.parseSummarySectionObject(summaryData, summarySec, perfChart, modOccupChart);
                loadMask(0);
                break;
            }

        case "base_getAllTaskData":
            {
                loadMask(1, "fetching data");
                let all_data = await taskm.getTasksForUser();
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
            }

        case "base_getAllVerificationData":
            {
                loadMask(1, "fetching verification data");
                let data = await taskm.getTaskVerificationCommitData();
                let data2 = await taskm.getTaskVerificationDeleteData();
                loadMask(1, "populating ui view");
                await tskv.loadSelfCommitsVerificationData(data);
                await tskv.loadSelfDeletesVerificationData(data2);
                loadMask(0);
                break;
            }

        case "base_getAllAssignmentData":
            {
                loadMask(1, "fetching assignment data");
                let summaryData = await taskm.getTaskSummaryData(true);
                let rscData = await taskm.getRSCUtilzationData(res["STR_USERID"], true);
                let assignmentData = await taskm.getRSCUtilzationData(res["STR_USERID"], false);
                loadMask(1, "populating ui view");
                tskv.loadAssignmentSummaryData(summaryData);
                tskv.loadResourceUtilizationData(rscData);
                tskv.loaTaskdAssignmentData(assignmentData);
                loadMask(0);
                break;
            }

        //---------------------------------------------------------------------
        // ADMIN OPERATIONS
        //---------------------------------------------------------------------
        case "admin_createProject":
            {
                loadMask(1, 'creatig new project');
                let title = document.getElementById('adm-Proj-Title').value;
                let result = await admin.createProject(title, res["STR_USERID"]);
                loadMask(0);
                if (result.operationStatus == "failed") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.ERROR, "ERROR: Failed to create project");
                }
                if (result.operationStatus == "partial") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.WARNING, "WARNING: Failed to assign project to the user");
                }
                if (result.operationStatus == "success") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.SUCCESS, "SUCCESS: Project created succssfully");
                }
                break;
            }

        case "admin_createUser":
            {
                loadMask(1, 'creatig new user');
                let result = await admin.createUser(params);
                loadMask(0);
                if (result.operationStatus == "failed") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.ERROR, "ERROR: Failed to create user");
                }
                if (result.operationStatus == "partial") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.WARNING, "WARNING: Failed to assign project to the user");
                }
                if (result.operationStatus == "success") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.SUCCESS, "SUCCESS: User created succssfully");
                }
                break;
            }

        case "admin_addUserProjectLink":
            {
                loadMask(1, 'updating user mappings');
                let userToTransfer = document.getElementById('adm-UsrAsi-Source').value;
                let projectId = document.getElementById('adm-UsrAsi-Target').value;
                let result = await admin.createUserProjectMap(userToTransfer, projectId);
                loadMask(0);
                if (result.operationStatus == "failed") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.ERROR, "ERROR: Failed to create User - Project link");
                }
                if (result.operationStatus == "success") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.SUCCESS, "SUCCESS: User - Project link created succssfully");
                }
                break;
            }

        case "admin_removeUserProjectLink":
            {
                loadMask(1, 'removing user mappings');
                let userToTransfer = document.getElementById('adm-UsrDeAsi-Source').value;
                let projectId = document.getElementById('adm-UsrDeAsi-Target').value;
                let result = await admin.removeUserProjectMap(userToTransfer, projectId);
                loadMask(0);
                if (result.operationStatus == "failed") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.ERROR, "ERROR: Failed to remove User - Project link");
                }
                if (result.operationStatus == "success") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.SUCCESS, "SUCCESS: User - Project link removed succssfully");
                }
                break;
            }

        case "admin_createTask":
            {
                loadMask(1, 'creatig new task');
                let result = await admin.createTask(params);
                loadMask(0);
                if (result.operationStatus == "success") {
                    popupNotification(res["POPUP_NOTIFICATION_MAP"]["type"]["SUCCESS"], "SUCCESS: Task created successfully")
                }
                else if (result.operationStatus == "partial") {
                    popupNotification(res["POPUP_NOTIFICATION_MAP"]["type"]["WARNING"], "WARNING: Task created partially. Please delete this task and tye to re-create the same task")
                }
                else {
                    popupNotification(res["POPUP_NOTIFICATION_MAP"]["type"]["ERROR"], "ERROR: There was some error in creating task. Please check your network connection and try again")
                }
                break;
            }

        case "admin_createAsset":
            {
                loadMask(1, 'creating new Asset');
                let projectId = document.getElementById("adm-Ast-Project").value;
                let category = document.getElementById("adm-Ast-Category").value;
                let categoryName = document.getElementById("adm-Ast-CatName").value;
                let result = {};
                switch (category) {
                    case "Module":
                        result = await admin.createModule(categoryName, projectId);
                        break;
                    case "Type":
                        result = await admin.createType(categoryName, projectId);
                        break;
                    case "Priority":
                        result = await admin.createPriority(categoryName, projectId);
                        break;
                }
                loadMask(0);
                if (result.operationStatus == "success") {
                    popupNotification(res["POPUP_NOTIFICATION_MAP"]["type"]["SUCCESS"], "SUCCESS: " + category + " created successfully")
                }
                else if (result.operationStatus == "partial") {
                    popupNotification(res["POPUP_NOTIFICATION_MAP"]["type"]["WARNING"], "WARNING: " + category + " created partially. Please delete this  " + category + "  and tye to re-create.")
                }
                else {
                    popupNotification(res["POPUP_NOTIFICATION_MAP"]["type"]["ERROR"], "ERROR: There was some error in creating  " + category + " . Please check your network connection and try again")
                }
                break;
            }

        case "admin_getAllProjectData":
            {
                loadMask(1, 'getting project data');
                let data = await admin.getProjectListForUser(res["STR_USERID"]);
                if (data !== undefined && data.operationStatus == "success") {
                    advl.loadProjectListData(data);
                    loadMask(0);
                }
                else {
                    loadMask(0);
                    popupNotification(res["POPUP_NOTIFICATION_MAP"]["type"]["ERROR"], "ERROR : No data received")
                }
                break;
            }

        case "admin_getUserAssignmentSource":
            {
                loadMask(1, 'getting user assignment data');
                let data = await admin.getUserDetailsByFilter(res["STR_USERID"], "", "small" , "same");
                let allProjectData = await admin.getAllProjects();
                advl.loadUserAssignmentDropdown(data, allProjectData);
                loadMask(0);
                break;
            }

        case "admin_getProjectListToRemoveUserAssignment":
            {
                loadMask(1, 'getting project list for user');
                let userId = document.getElementById('adm-UsrDeAsi-Source').value;
                let data = await admin.getProjectListForUser(res["STR_USERID"]);
                console.log(data);
                advl.loadUserAssignmentProjDropdown(data)
                loadMask(0);
                break;
            }

        case "admin_getProjectListForTask":
            {
                loadMask(1, 'getting project list');
                let data = await admin.getProjectListForUser(res["STR_USERID"]);
                advl.loadTaskProjectDropdown(data);
                loadMask(0);
                break;
            }

        case "admin_getProjectListForUser":
            {
                loadMask(1, 'getting project list');
                let data = await admin.getProjectListForUser(res["STR_USERID"]);
                let roleData = await admin.getSmallerRoles(res["STR_ROLEID"]);
                advl.loadUserProjectDropdown(data);
                advl.loadUserRoleDropdown(roleData);
                loadMask(0);
                break;
            }

        case "admin_getProjectListForAssets":
            {
                loadMask(1, 'getting project list');
                let data = await admin.getProjectListForUser(res["STR_USERID"]);
                advl.loadAssetProjectDropdown(data);
                loadMask(0);
                break;
            }

        case "admin_getModuleTypePriorityListForTask":
            {
                loadMask(1, 'getting Modules , Types & Priority for project');
                let projectId = document.getElementById("adm-Tsk-Project").value
                let moduleData = await admin.getModuleListForProject(projectId);
                let typeData = await admin.getTypeListForProject(projectId);
                let priorityData = await admin.getPriorityListForProject(projectId);
                let userData = await admin.getUserDetailsByFilter( res["STR_USERID"], projectId , "smaller_and_equal" , "same");
                console.log(userData);
                advl.loadTaskModuleDropdown(moduleData);
                advl.loadTaskTypeDropdown(typeData);
                advl.loadTaskPriorityDropdown(priorityData);
                advl.loadTaskUserDropdown(userData);
                loadMask(0);
                break;
            }

        case "admin_getModuleTypePriorityListForAssets":
            {
                loadMask(1, "getting Modules , Types & Priorities");
                let projectId = document.getElementById("adm-Ast-Project").value
                let moduleData = await admin.getModuleListForProject(projectId);
                let typeData = await admin.getTypeListForProject(projectId);
                let priorityData = await admin.getPriorityListForProject(projectId);
                advl.loadAssetModuleListData(moduleData);
                advl.loadAssetTypeListData(typeData);
                advl.loadAssetPriorityListData(priorityData);
                loadMask(0);
                break;
            }

        case "admin_getTypeListForTask":
            {
                loadMask(1, 'getting module list');
                let projectId = document.getElementById("adm-Tsk-Project").value
                let data = await admin.getModuleListForProject(projectId);
                advl.loadTaskModuleDropdown(data);
                loadMask(0);
                break;
            }

        case "admin_addRole":
            {
                loadMask(1, 'adding Role to system');
                let roleName = document.getElementById('adm-Role-RoleName').value;
                let roleOrder = document.getElementById('adm-Role-RoleOrder').value;
                let result = await admin.createNewRole(roleName, roleOrder);
                loadMask(0);
                if (result.operationStatus == "failed") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.ERROR, "ERROR: Failed to create role");
                }
                if (result.operationStatus == "success") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.SUCCESS, "SUCCESS: Role created succssfully");
                }
                break;
            }

        case "admin_getRoleList":
            {
                loadMask(1, 'adding Role to system');
                let data = await admin.getRoleData();
                advl.loadRoleData(data)
                loadMask(0);
                break;
            }

        case "admin_roleAssigmentSource":
            {
                loadMask(1, 'getting user assignment data');
                let data = await admin.getUserDetailsByFilter(res["STR_USERID"], "", "small" , "same");
                advl.loadRoleAssignmentUserDropdown(data)
                loadMask(0);
                break;
            }

        case "admin_getRoleListForRoleAssignment":
            {
                loadMask(1, 'getting role list for user');
                let userId = document.getElementById('adm-Rleassign-User').value;
                let data = await admin.getRoleIdForUser(userId);
                let roleData = await admin.getValidRoles(data[0], res["STR_ROLEID"]);
                advl.loadRoleAssignmentRoleDropdown(roleData)
                loadMask(0);
                break;
            }

        case "admin_updateRoleAssignment":
            {
                loadMask(1, 'updating role asssignment for user');
                let userId = document.getElementById('adm-Rleassign-User').value;
                let roleId = document.getElementById('adm-Rleassign-Role').value;
                let result = await admin.updateRoleAssignment(userId, roleId);
                loadMask(0);
                if (result.operationStatus == "failed") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.ERROR, "ERROR: Failed to update role");
                }
                if (result.operationStatus == "success") {
                    popupNotification(res.POPUP_NOTIFICATION_MAP.type.SUCCESS, "SUCCESS: Role updated succssfully");
                }
                break;
            }

        case "admin_getAcountDeleteData":
            {
                loadMask(1, "checking assigments and task status")
                let projectData = await admin.getProjectListForUser(res["STR_USERID"]);
                let userData = [];
                if (projectData != undefined && projectData.length !== 0) {
                    userData = await admin.getUsersWithEqualRole(res.STR_USERID, res.STR_ROLEID)
                    advl.loadProjectUserDeleteDropdown(projectData, userData);
                }
                let taskAssignerData = await taskm.getTaskByAssigner(res["STR_USERID"])
                let taskOwnerData = await taskm.getTaskByOwner(res["STR_USERID"])
                if ((taskAssignerData !== undefined) && (taskOwnerData != undefined) && (taskAssignerData.length !== 0) && (taskOwnerData !== 0)) {
                    if (userData == []) {
                        userData = await admin.getUsersWithEqualRole(res.STR_USERID, res.STR_ROLEID)
                    }
                    advl.loadTaskUserDeleteDropdown(userData);
                }
                loadMask(0);
                break;
            }

        case "admin_accDeleteProjectAssign":
            {
                loadMask(1, "updating project and user mapping");
                let projectId = document.getElementById('adm-accDel-Project').value;
                let userId = document.getElementById('adm-accDel-ProjectUser').value;
                await admin.updateUserProjectMapforDeleteOperation(projectId, userId, res["STR_USERID"]);
                loadMask(0);
                break;
            }

        case "admin_accDeleteUserAssign":
            {
                loadMask(1, "update task assignments mapping");
                let userData = await admin.getUsersWithEqualRole(res.STR_USERID, res.STR_ROLEID);
                let userMap = admin.generateUserMap(userData);
                let newAssignerId = document.getElementById('adm-accDel-TaskAssigner').value;
                let newOwnerId = document.getElementById('adm-accDel-TaskOwner').value;

                if (newAssignerId !== 'select') {
                    let data = {};
                    data["Assigner"] = {}
                    data["Assigner"]["OldAssigner"] = res.STR_USERNAME
                    data["Assigner"]["OldAssignerId"] = res.STR_USERID
                    data["Assigner"]["NewAssigner"] = userMap[newAssignerId]
                    data["Assigner"]["NewAssignerId"] = newAssignerId
                    await taskm.updateTaskFieldsForAccountDelete(data);
                }
                if (newOwnerId !== 'select') {
                    let data = {};
                    data["Owner"] = {}
                    data["Owner"]["OldOwner"] = userMap[res.STR_USERID]
                    data["Owner"]["OldOwnerId"] = res.STR_USERID
                    data["Owner"]["NewOwner"] = userMap[newOwnerId]
                    data["Owner"]["NewOwnerId"] = newOwnerId
                    await taskm.updateTaskFieldsForAccountDelete(data);
                }
                loadMask(0);
                break;
            }

        //---------------------------------------------------------------------
        // TASKBOARD OPERATIONS
        //---------------------------------------------------------------------    
        case "tsb_NextTaskWorkflowState":
            {
                loadMask(1, "performing operation");
                await taskm.updateNextTaskWorkflowState(res["TASKDATA_TABLE"]);
                loadMask(0);
                break;
            }

        case "tsb_TaskToSelfCommitState":
            {
                loadMask(1, "performing self commit operation");
                await taskm.updateTaskWorkflowStateToSelfCommit(res["TASKDATA_TABLE"]);
                loadMask(0);
                break;
            }

        case "tsb_TaskToSelfDeleteState":
            {
                loadMask(1, "performing self delete operation");
                await taskm.updateTaskWorkflowStateToSelfDelete(res["TASKDATA_TABLE"]);
                loadMask(0);
                break;
            }

        case "tsb_OpenTaskDetails":
            {
                openTaskDetails(values);
                break;
            }
        //---------------------------------------------------------------------
        // TASK VERIFICATION OPERATIONS
        //---------------------------------------------------------------------    

        case "tskv_MarkTaskAsComplete":
            {
                loadMask(1, "updating task status");
                await taskm.TSKV_updateTaskToComplete(values);
                loadMask(0);
                break;
            }

        case "tskv_MarkTaskAsDelete":
            {
                loadMask(1, "updating task status");
                await taskm.TSKV_updateTaskToDelete(values);
                loadMask(0);
                break;
            }

        case "tskv_MarkTaskAsRevert":
            {
                loadMask(1, "updating task status");
                await taskm.TSKV_revertTask(values);
                loadMask(0);
                break;
            }

        case "tskv_MarkMultiTaskAsComplete":
            {
                loadMask(1, "updating multiple task status");
                await taskm.TSKV_updateTaskToComplete_Multi(res["TASKVERIFICATION_SLFCOMMIT_TABLE"])
                loadMask(0);
                break;
            }

        case "tskv_MarkMultiTaskAsDelete":
            {
                loadMask(1, "updating multiple task status");
                await taskm.TSKV_updateTaskToDelete_Multi(res["TASKVERIFICATION_SLFDELETE_TABLE"])
                loadMask(0);
                break;
            }

        case "tskv_MarkMultiTaskAsRevert":
            {
                loadMask(1, "reverting tasks");
                let tablename = "";
                if (values == "SelfCommitTable") {
                    tablename = res["TASKVERIFICATION_SLFCOMMIT_TABLE"]
                }
                if (values == "SelfDeleteTable") {
                    tablename = res["TASKVERIFICATION_SLFDELETE_TABLE"]
                }
                await taskm.TSKV_revertTask_Multi(tablename);
                loadMask(0);
                break;
            }

        default:
            break;

    }
}
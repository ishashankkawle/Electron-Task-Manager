let dbOperations = require('../core/databaseOperations');
let Util = require('../core/util');
let res = require('../shared/resources');

const util = new Util();


module.exports = class adminManager {

    async createTask() {
            let data = [];
            const dbOps = new dbOperations();
            data.push("nextval('master_db_id_sequence')");
            data.push(document.getElementById('adm-Tsk-Project').value);
            data.push(document.getElementById('adm-Tsk-Module').value);
            data.push(document.getElementById('adm-Tsk-Title').value);
            data.push(document.getElementById('adm-Tsk-Desc').value);
            data.push(document.getElementById('adm-Tsk-ETA').value);
            data.push(document.getElementById('adm-Tsk-Owner').value);
            data.push(res["STR_USERID"]);
            data.push(res["WORKFLOW"]["STR_WF_NEW"]);
            data.push(document.getElementById('adm-Tsk-Type').value);
            data.push(document.getElementById('adm-Tsk-Priority').value);
            data.push(util.getCurrentDateString());


            let keys = ["TaskId", "ProjectId", "Module", "Title", "Description", "DateTerminated", "Owner", "Assigner", "TaskStatus", "Type", "Priority", "DateCreated"];

            let keyString = util.generateCustomArrayString("\"", keys);
            let arrColsToIgore = [0];
            let dataString = util.generateCustomArrayString("\'", data, arrColsToIgore);

            let result = await this.addObjectToDatabase("Task_master", keyString, dataString, dbOps);
            let obj = util.generateJSONObject(keys, data);
            obj["TaskId"] = result["rows"][0]["TaskId"];
            obj["Activity"] = [];
            let mongoRes = dbOps.addBlobData("TSSTaskHistory", "TSSTaskHistoryCollection", obj);
            console.log(mongoRes);
    }

    async getAllProjects() {
        let columns = ["\"ProjectId\"", "\"ProjectName\""];
        const dbOps = new dbOperations();
        let data = await dbOps.getData("Project_Master", columns)
        return data["rows"];
    }

    //-----------------------------------------------------------
    // USER CREATION OPERATIONS
    //-----------------------------------------------------------
    async createUser() {
        console.log("INSIDE USER CREATION")
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(document.getElementById('adm-Usr-Name').value);
        data.push(document.getElementById('adm-Usr-Contact').value);
        data.push(document.getElementById('adm-Usr-DOB').value);
        data.push(document.getElementById('adm-Usr-Email').value);
        data.push(document.getElementById('adm-Usr-Email').value);
        data.push(document.getElementById('adm-Usr-Password').value);
        data.push("0");
        data.push(util.getCurrentDateString());

        let keys = ["UserId", "Name", "Contact", "DOB", "Email", "UserName", "Password", "RoleId", "DateCreated"]
        let arrEncryptedCols = [5, 6];

        for (let index = 0; index < data.length; index++) {
            let flag = false;
            for (let index2 = 0; index2 < arrEncryptedCols.length; index2++) {
                if (index == arrEncryptedCols[index2]) {
                    flag = true
                }
            }
            if (flag) {
                data[index] = " PGP_SYM_ENCRYPT( '" + data[index] + "' , 'AES_KEY') "
            }
        }

        let keyString = util.generateCustomArrayString("\"", keys);
        let arrColsToIgore = [0, 5, 6];
        let dataString = util.generateCustomArrayString("\'", data, arrColsToIgore);
        let result = await this.addObjectToDatabase("User_master", keyString, dataString, dbOps);
        console.log(result);
    }

    async getUserId(email) {
        let columns = ["\"UserId\""];
        const dbOps = new dbOperations();
        let conditon = "\"Email\" = \'" + email + "\'"
        let data = await dbOps.getData("User_master", columns, conditon)
        return data["rows"][0]["UserId"];
    }

    // async createUserAssignerMap(userId, assignerId) {
    //     let data = [];
    //     const dbOps = new dbOperations();
    //     data.push(userId);
    //     data.push(assignerId);
    //     let keys = ["UserId", "ReportingUserId"];
    //     let keyString = util.generateCustomArrayString("\"", keys);
    //     let dataString = util.generateCustomArrayString("\'", data);
    //     let result = dbOps.addData("user_user_map", keyString, dataString);
    //     console.log(result);
    // }

    // async updateUserAssignerMap(userId, targetUerId) {
    //     const dbOps = new dbOperations();
    //     let arrColumns = ["\"ReportingUserId\""];
    //     let arrData = [targetUerId];
    //     let conditon = "\"UserId\" = '" + userId + "'";
    //     let result = dbOps.updateData("user_user_map", arrColumns, arrData, conditon);
    //     console.log(result);
    // }

    async createUserProjectMap(userId, projectId) {
        let columns = ["\"UserId\"", "\"ProjectId\""];
        const dbOps = new dbOperations();
        let conditon = "\"UserId\" = '" + userId + "' AND \"ProjectId\" = '" + projectId + "'";
        let dataCount = await dbOps.getData("user_project_map", columns, conditon)
        if (dataCount["rowCount"] == 0) {
            let data = [];
            const dbOps = new dbOperations();
            data.push(userId);
            data.push(projectId);
            let keys = ["UserId", "ProjectId"];
            let keyString = util.generateCustomArrayString("\"", keys);
            let dataString = util.generateCustomArrayString("\'", data);
            let result = dbOps.addData("user_project_map", keyString, dataString);
        }
    }

    async updateUserProjectMap(userId, projectId, currentProjectId) {
        const dbOps = new dbOperations();
        let arrColumns = ["\"ProjectId\""];
        let arrData = [projectId];
        let conditon = "\"UserId\" = '" + userId + "' AND \"ProjectId\" = '" + currentProjectId + "'";
        let result = dbOps.updateData("user_project_map", arrColumns, arrData, conditon);
        console.log(result);
    }

    async updateUserProjectMapforDeleteOperation(projectId , userId , currentUsserId)
    {
        const dbOps = new dbOperations();
        let arrColumns = ["\"UserId\""];
        let arrData = [userId];
        let conditon = "\"UserId\" = '" + currentUsserId + "' AND \"ProjectId\" = '" + projectId + "'";
        let result = dbOps.updateData("user_project_map", arrColumns, arrData, conditon);
        console.log(result);
    }

    //-----------------------------------------------------------
    // ASSETS OPERATIONS
    //-----------------------------------------------------------
    async createModule(moduleName) {
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(moduleName);
        data.push(util.getCurrentDateString());
        let keys = ["ModuleId", "Module", "DateCreated"];
        let arrColsToIgore = [0];
        let keyString = util.generateCustomArrayString("\"", keys);
        let dataString = util.generateCustomArrayString("\'", data, arrColsToIgore);
        var result = await this.addObjectToDatabase("Module_master", keyString, dataString, dbOps);
        console.log(result);

    }

    async getModuleId(moduleName) {
        let columns = ["\"ModuleId\""];
        const dbOps = new dbOperations();
        let conditon = "\"Module\" = \'" + moduleName + "\'"
        let data = await dbOps.getData("Module_master", columns, conditon)
        return data["rows"][0]["ModuleId"];
    }

    async createModuleProjectMap(moduleId, projectId) {
        let data = [];
        const dbOps = new dbOperations();
        data.push(moduleId);
        data.push(projectId);
        let keys = ["ModuleId", "ProjectId"];
        let keyString = util.generateCustomArrayString("\"", keys);
        let dataString = util.generateCustomArrayString("\'", data);
        let result = dbOps.addData("module_project_map", keyString, dataString);
        console.log(result);
    }

    async createType(typeName) {
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(typeName);
        data.push(util.getCurrentDateString());
        let keys = ["TypeId", "Type", "DateCreated"];
        let arrColsToIgore = [0];
        let keyString = util.generateCustomArrayString("\"", keys);
        let dataString = util.generateCustomArrayString("\'", data, arrColsToIgore);
        var result = await this.addObjectToDatabase("Type_master", keyString, dataString, dbOps);
        console.log(result);
    }

    async getTypeId(typeName) {
        let columns = ["\"TypeId\""];
        const dbOps = new dbOperations();
        let conditon = "\"Type\" = \'" + typeName + "\'"
        let data = await dbOps.getData("Type_master", columns, conditon)
        return data["rows"][0]["TypeId"];
    }

    async createTypeProjectMap(typeId, projectId) {
        let data = [];
        const dbOps = new dbOperations();
        data.push(typeId);
        data.push(projectId);
        let keys = ["TypeId", "ProjectId"];
        let keyString = util.generateCustomArrayString("\"", keys);
        let dataString = util.generateCustomArrayString("\'", data);
        let result = dbOps.addData("type_project_map", keyString, dataString);
        console.log(result);
    }

    async createPriority(priorityName) {
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(priorityName);
        data.push(util.getCurrentDateString());
        let keys = ["PriorityId", "Priority", "DateCreated"];
        let arrColsToIgore = [0];
        let keyString = util.generateCustomArrayString("\"", keys);
        let dataString = util.generateCustomArrayString("\'", data, arrColsToIgore);
        var result = await this.addObjectToDatabase("Priority_master", keyString, dataString, dbOps);
        console.log(result);
    }

    async getPriorityId(priorityName) {
        let columns = ["\"PriorityId\""];
        const dbOps = new dbOperations();
        let conditon = "\"Priority\" = \'" + priorityName + "\'"
        let data = await dbOps.getData("Priority_master", columns, conditon)
        return data["rows"][0]["PriorityId"];
    }

    async createPriorityProjectMap(priorityId, projectId) {
        let data = [];
        const dbOps = new dbOperations();
        data.push(priorityId);
        data.push(projectId);
        let keys = ["PriorityId", "ProjectId"];
        let keyString = util.generateCustomArrayString("\"", keys);
        let dataString = util.generateCustomArrayString("\'", data);
        let result = dbOps.addData("priority_project_map", keyString, dataString);
        console.log(result);
    }

    //-----------------------------------------------------------
    // PROJECT CREATION OPERATIONS
    //-----------------------------------------------------------
    async createProject() {
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(document.getElementById('adm-Proj-Title').value);
        data.push(util.getCurrentDateString());
        let keys = ["ProjectId", "ProjectName", "DateCreated"];
        let keyString = util.generateCustomArrayString("\"", keys);
        let arrColumnsToIgnore = [];
        arrColumnsToIgnore.push(0);
        let dataString = util.generateCustomArrayString("\'", data, arrColumnsToIgnore);
        var result = await this.addObjectToDatabase("Project_master", keyString, dataString, dbOps);
        console.log(result);
    }

    async getProjectIdFromProjectName(ProjectName) {
        let columns = ["\"ProjectId\""];
        const dbOps = new dbOperations();
        let conditon = "\"ProjectName\" = \'" + ProjectName + "\'"
        let data = await dbOps.getData("Project_Master", columns, conditon)
        return data["rows"][0]["ProjectId"];
    }

    async getProjectIdFromUser(userId) {
        let columns = ["\"ProjectId\""];
        const dbOps = new dbOperations();
        let conditon = "\"UserId\" = \'" + userId + "\'"
        let data = await dbOps.getData("user_project_map", columns, conditon)
        data = data["rows"];
        let output = [];
        for (let index = 0; index < data.length; index++) {
            output.push(data[index]["ProjectId"]);
        }
        return output;
    }

    async getProjectListData(userId) {
        let columns = ["\"ProjectName\""];
        const dbOps = new dbOperations();
        let conditon = "\"UserId\" = \'" + userId + "\'"
        let data = await dbOps.getData("View_ProjectList", columns, conditon)
        return data["rows"]
    }

    async getRoleIdForUser(userId) {
        let columns = ["\"RoleId\""];
        const dbOps = new dbOperations();
        let conditon = " \"UserId\" = '" + userId + "'";
        let data = await dbOps.getData("View_UserProjectMap", columns, conditon, true);
        data = data["rows"];
        let output = [];
        for (let index = 0; index < data.length; index++) {
            output.push(data[index]["RoleId"]);
        }
        return output;
    }

    async getValidRoles(userRoleId, upgraderRoleId) {
        let columns = ["\"RoleName\" , \"SecurityLevel\""];
        const dbOps = new dbOperations();
        let conditon = " \"SecurityLevel\" > '" + upgraderRoleId + "' AND \"SecurityLevel\" < '" + userRoleId + "'";
        let data = await dbOps.getData("Role_Master", columns, conditon, true);
        return data["rows"];
    }

    async getProjectListForUser(userId) {
        let columns = ["\"ProjectName\"", "\"ProjectId\""];
        const dbOps = new dbOperations();
        let conditon = "\"UserId\" = \'" + userId + "\'"
        let data = await dbOps.getData("View_UserProjectMap", columns, conditon)
        return data["rows"]
    }

    async getSmallerRoles(roleId) {
        let columns = ["\"RoleName\"", "\"SecurityLevel\""];
        const dbOps = new dbOperations();
        let conditon = "\"SecurityLevel\" > \'" + roleId + "\'"
        let data = await dbOps.getData("Role_Master", columns, conditon)
        return data["rows"]
    }

    async getProjectListForUserDeAssignment(userId, assignerUserId) {
        let columns = "*";
        let source = "(SELECT \"ProjectId\" , \"ProjectName\" FROM VIEW_USERPROJECTMAP  WHERE \"UserId\" = '" + userId + "' )vupm"
        const dbOps = new dbOperations();
        let condition;
        let option = "JOIN (SELECT \"ProjectId\" , \"ProjectName\" FROM VIEW_USERPROJECTMAP WHERE \"UserId\" = '" + assignerUserId + "')vupm1 ON (vupm.\"ProjectId\"::TEXT = vupm1.\"ProjectId\")"
        let data = await dbOps.getData(source, columns, condition, false, option)
        return data["rows"]
    }

    async removeUserProjectMap(userId, projectId) {
        const dbOps = new dbOperations();
        let conditon = "\"UserId\" = \'" + userId + "\' AND \"ProjectId\" = '" + projectId + "'"
        let data = await dbOps.deleteData("User_Project_Map", conditon)
        return data["rows"]
    }

    async getUsersWithSmallRoleFromSameProject(userId, roleId) {
        let projectId = await this.getProjectIdFromUser(userId);
        let projectIdString = util.generateCustomArrayString("\'", projectId);
        let columns = ["\"UserId\"", "\"Name\""];
        const dbOps = new dbOperations();
        let conditon = "\"ProjectId\" IN (" + projectIdString + ") AND \"RoleId\" > \'" + roleId + "\' AND \"UserId\" <> '" + userId + "'"
        let data = await dbOps.getData("View_UserProjectMap", columns, conditon, true)
        return data["rows"]
    }

    async getUsersWithSmallOrEqualRoleFromSameProject(userId, roleId) {
        let projectId = await this.getProjectIdFromUser(userId);
        let projectIdString = util.generateCustomArrayString("\'", projectId);
        let columns = ["\"UserId\"", "\"Name\""];
        const dbOps = new dbOperations();
        let conditon = "\"ProjectId\" IN (" + projectIdString + ") AND \"RoleId\" >= \'" + roleId + "\' AND \"UserId\" <> '" + userId + "'"
        let data = await dbOps.getData("View_UserProjectMap", columns, conditon, true)
        return data["rows"]
    }

    async getUsersWithEqualRole(userId, roleId) {
        let columns = ["\"UserId\"", "\"Name\""];
        const dbOps = new dbOperations();
        let conditon = "\"RoleId\" = \'" + roleId + "\' AND \"UserId\" <> '" + userId + "'"
        let data = await dbOps.getData("View_UserProjectMap", columns, conditon, true)
        return data["rows"]
    }

    async getUsersFromProjectWithSmallOrEqualRole(projectId, userId, roleId) {
        let columns = ["\"UserId\"", "\"Name\""];
        const dbOps = new dbOperations();
        let conditon = "\"ProjectId\" = '" + projectId + "' AND \"RoleId\" >= \'" + roleId + "\' AND \"UserId\" <> '" + userId + "'"
        let data = await dbOps.getData("View_UserProjectMap", columns, conditon, true)
        return data["rows"]
    }

    async getModuleListForProject(projectId) {
        let columns = ["\"ModuleId\"", "\"Module\""];
        const dbOps = new dbOperations();
        let conditon = "\"ProjectId\" = \'" + projectId + "\'"
        let data = await dbOps.getData("View_moduleProjectMap", columns, conditon)
        return data["rows"]
    }

    async getTypeListForProject(projectId) {
        let columns = ["\"TypeId\"", "\"Type\""];
        const dbOps = new dbOperations();
        let conditon = "\"ProjectId\" = \'" + projectId + "\'"
        let data = await dbOps.getData("View_TypeProjectMap", columns, conditon)
        return data["rows"]
    }

    async getPriorityListForProject(projectId) {
        let columns = ["\"PriorityId\"", "\"Priority\""];
        const dbOps = new dbOperations();
        let conditon = "\"ProjectId\" = \'" + projectId + "\'"
        let data = await dbOps.getData("View_PriorityProjectMap", columns, conditon)
        return data["rows"]
    }

    async createNewRole(roleName, roleOrder) {
        let data = [];
        const dbOps = new dbOperations();
        data.push("nextval('master_db_id_sequence')");
        data.push(roleName);
        data.push(roleOrder);
        let arrColsToIgore = [0];
        let keys = ["RoleId", "RoleName", "SecurityLevel"];
        let keyString = util.generateCustomArrayString("\"", keys);
        let dataString = util.generateCustomArrayString("\'", data, arrColsToIgore);
        var result = await this.addObjectToDatabase("Role_Master", keyString, dataString, dbOps);
        console.log(result);
    }

    async getRoleData() {
        let columns = ["\"RoleName\"", "\"SecurityLevel\""];
        const dbOps = new dbOperations();
        let option = "Order By \"SecurityLevel\" ASC";
        let data = await dbOps.getData("Role_Master", columns, "", false, option)
        return data["rows"];
    }

    async updateRoleAssignment(userId, roleId) {
        const dbOps = new dbOperations();
        let arrColumns = ["\"RoleId\""];
        let arrData = [roleId];
        let conditon = "\"UserId\" = '" + userId + "'";
        let result = dbOps.updateData("user_master", arrColumns, arrData, conditon);
        console.log(result);
    }

    generateUserMap(userData)
    {
        let output = {}
        for (let index = 0; index < userData.length; index++) 
        {
           output[userData[index]["UserId"]] = userData[index]["Name"]
        }
        return output;
    }

    //-----------------------------------------------------------
    // GENERIC OPERATIONS
    //-----------------------------------------------------------
    async addObjectToDatabase(type, keys, arrData, dbOps, isEncrypted, arrEncrypted) {
        if (isEncrypted) {
            var result = dbOps.addEncryptedData(type, keys, arrData, arrEncrypted)
        }
        else {
            var result = dbOps.addData(type, keys, arrData)
        }
        return result;

    }
}
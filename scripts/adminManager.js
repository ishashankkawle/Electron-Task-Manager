let dbOperations = require('../core/databaseOperations');
let httpOperations = require('../core/httpHandler');
let Util = require('../core/util');
let res = require('../shared/resources');

const util = new Util();


module.exports = class adminManager {

    async createTask() {
        let data = {
            "projectId": document.getElementById('adm-Tsk-Project').value,
            "module": document.getElementById('adm-Tsk-Module').value,
            "title": document.getElementById('adm-Tsk-Title').value,
            "description": document.getElementById('adm-Tsk-Desc').value,
            "dateTerminated": document.getElementById('adm-Tsk-ETA').value,
            "owner": document.getElementById('adm-Tsk-Owner').value,
            "assigner": res["STR_USERID"],
            "taskStatus": res["WORKFLOW"]["STR_WF_NEW"],
            "type": document.getElementById('adm-Tsk-Type').value,
            "priority": document.getElementById('adm-Tsk-Priority').value
        }
        const http = new httpOperations();
        let result = await http.httpPost(res["STR_BASEPATH"] + "/task", data, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return result;
        }
        return result;
    }

    async getAllProjects() {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/project", http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return result;
        }
        return result;
    }

    async createUser() {
        let data = {
            "name": document.getElementById('adm-Usr-Name').value,
            "contact": document.getElementById('adm-Usr-Contact').value,
            "dob": document.getElementById('adm-Usr-DOB').value,
            "email": document.getElementById('adm-Usr-Email').value,
            "username": document.getElementById('adm-Usr-Email').value,
            "password": document.getElementById('adm-Usr-Password').value,
            "roleId": document.getElementById('adm-Usr-Role').value,
            "projectId": document.getElementById('adm-Usr-Project').value
        }
        console.log(data);
        const http = new httpOperations();
        let result = await http.httpPost(res["STR_BASEPATH"] + "/user", data, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            result.operationStatus = "partial";
        }
        return result;
    }

    async createUserProjectMap(userId, projectId) {
        const http = new httpOperations();
        let body = {
            "userId": userId,
            "projectId": projectId
        }
        let result = await http.httpPost(res["STR_BASEPATH"] + "/userprojectmap", body, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return result;
        }
        return result;
    }

    async updateUserProjectMap(userId, projectId, currentProjectId) {
        const http = new httpOperations();
        let body = {};
        body["userId"] = userId;
        body["oldProjectId"] = currentProjectId;
        body["newProjectId"] = projectId;
        let result = await http.httpPut(res["STR_BASEPATH"] + "/userprojectmap", body, http.getDefaultHeaders());
        result.operationStatus = "success";
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!
    // PENDING CHANGE
    // !!!!!!!!!!!!!!!!!!!!!!!!!!
    async updateUserProjectMapforDeleteOperation(projectId, userId, currentUsserId) {
        const dbOps = new dbOperations();
        let arrColumns = ["\"UserId\""];
        let arrData = [userId];
        let conditon = "\"UserId\" = '" + currentUsserId + "' AND \"ProjectId\" = '" + projectId + "'";
        let result = dbOps.updateData("user_project_map", arrColumns, arrData, conditon);
        console.log(result);
    }
    // !!!!!!!!!!!!!!!!!!!!!!!!!!
    // PENDING CHANGE
    // !!!!!!!!!!!!!!!!!!!!!!!!!!


    async createModule(moduleName, projectId) {
        const http = new httpOperations();
        let body = {
            "module": moduleName,
            "projectId": projectId
        };
        let result = await http.httpPost(res["STR_BASEPATH"] + "/module", body, http.getDefaultHeaders());
        return result;
    }

    async createType(typeName, projectId) {
        const http = new httpOperations();
        let body = {
            "type": typeName,
            "projectId": projectId
        };
        let result = await http.httpPost(res["STR_BASEPATH"] + "/type", body, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return result;
        }
        return result;
    }

    async createPriority(priorityName, projectId) {
        const http = new httpOperations();
        let body = {
            "priority": priorityName,
            "projectId": projectId
        };
        let result = await http.httpPost(res["STR_BASEPATH"] + "/priority", body, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return result;
        }
        return result;
    }

    async createProject(title, userId) {
        let data = {
            "title": title,
            "userId": userId
        };
        const http = new httpOperations();
        let result = await http.httpPost(res["STR_BASEPATH"] + "/project", data, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return result;
        }
        return result;
    }

    // async getProjectIdFromProjectName(ProjectName) {
    //     let columns = ["\"ProjectId\""];
    //     const dbOps = new dbOperations();
    //     let conditon = "\"ProjectName\" = \'" + ProjectName + "\'"
    //     let data = await dbOps.getData("Project_Master", columns, conditon)
    //     if (data.operationStatus == "failed") {
    //         return undefined;
    //     }
    //     return data["rows"][0]["ProjectId"];
    // }

    // async getProjectIdFromUser(userId) {
    //     let columns = ["\"ProjectId\""];
    //     const dbOps = new dbOperations();
    //     let conditon = "\"UserId\" = \'" + userId + "\'"
    //     let data = await dbOps.getData("user_project_map", columns, conditon)
    //     if (data.operationStatus == "failed") {
    //         return undefined;
    //     }
    //     data = data["rows"];
    //     let output = [];
    //     for (let index = 0; index < data.length; index++) {
    //         output.push(data[index]["ProjectId"]);
    //     }
    //     return output;
    // }

    async getProjectListForUser(userId) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/project?userId=" + userId, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    async getRoleIdForUser(userId) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/role?userId=" + userId, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    async getValidRoles(userRoleId, upgraderRoleId) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/role/validlist?updaterroleid=" + upgraderRoleId + "&userroleid=" + userRoleId, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    async getSmallerRoles(roleId) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/role/small?userroleid=" + roleId, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!
    // PENDING CHANGE
    // !!!!!!!!!!!!!!!!!!!!!!!!!!
    async removeUserProjectMap(userId, projectId) {
        const dbOps = new dbOperations();
        let conditon = "\"UserId\" = \'" + userId + "\' AND \"ProjectId\" = '" + projectId + "'"
        let result = await dbOps.deleteData("User_Project_Map", conditon)
        return result;
    }
    // !!!!!!!!!!!!!!!!!!!!!!!!!!
    // PENDING CHANGE
    // !!!!!!!!!!!!!!!!!!!!!!!!!!

    async getUserDetails(email) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/user?email=" + email, http.getDefaultHeaders());
        return result;
    }

    async getUserDetailsByFilter(userId, projectId, roleFilterValue, projectFilterValue) {
        let url = res["STR_BASEPATH"] + "/user?userId=" + userId;
        if (projectId != undefined) {
            url = url + "&projectId=" + projectId;
        }
        if (roleFilterValue != undefined) {
            url = url + "&roleFilter=" + roleFilterValue;
        }
        if (projectFilterValue != undefined) {
            url = url + "&projectFilter=" + projectFilterValue;
        }
        const http = new httpOperations();
        console.log("url = " + url);
        let result = await http.httpGet(url, http.getDefaultHeaders());
        return result;
    }

    async getModuleListForProject(projectId) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/module?projectId=" + projectId, http.getDefaultHeaders());
        result.operationStatus = "success";
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    async getTypeListForProject(projectId) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/type?projectId=" + projectId, http.getDefaultHeaders());
        result.operationStatus = "success";
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    async getPriorityListForProject(projectId) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/priority?projectId=" + projectId, http.getDefaultHeaders());
        result.operationStatus = "success";
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    async createNewRole(roleName, roleOrder) {
        let data = {
            "roleName": roleName,
            "securityLevel": roleOrder
        }
        const http = new httpOperations();
        let result = await http.httpPost(res["STR_BASEPATH"] + "/role", data, http.getDefaultHeaders());
        result.operationStatus = "success"
        if (result.operationStatus == "failed") {
            return result;
        }
        return result;
    }

    async getRoleData() {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/role", http.getDefaultHeaders());
        result.operationStatus = "success";
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    async updateUser(userId, fieldName, fieldValue) {
        const http = new httpOperations();
        let body = {};
        body["userId"] = userId;
        body["field"] = fieldName;
        body["fieldValue"] = fieldValue;
        body["isSecret"] = "false";
        if (fieldName == "Password") {
            body["isSecret"] = "true"
        }
        let result = await http.httpPut(res["STR_BASEPATH"] + "/user/" + userId, body, http.getDefaultHeaders());
        result.operationStatus = "success";
        if (result.operationStatus == "failed") {
            return undefined;
        }
        return result;
    }

    generateUserMap(userData) {
        let output = {}
        for (let index = 0; index < userData.length; index++) {
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
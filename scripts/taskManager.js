let dbOperations = require('../core/databaseOperations');
let httpOperations = require('../core/httpHandler');
let res = require('../shared/resources');
let Workflow = require('../core/workflowOperations');
const Util = require('../core/util');
const fs = require('fs')
const axios = require('axios');

const util = new Util();


module.exports = class taskManager {
    constructor() {
        this.wf = new Workflow();
    }

    async getTasksByFilter(filter, filterValue) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/task?taskFilter=" + filter + "&filterParam=" + filterValue, http.getDefaultHeaders());
        return result;
    }

    async getSingleTaskData(taskId) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/task/" + taskId + "?activity=false", http.getDefaultHeaders());
        return result;
    }

    async getTaskActivityData(taskId) {
        const http = new httpOperations()
        let result = await http.httpGet(res["STR_BASEPATH"] + "/task/" + taskId + "?activity=true", http.getDefaultHeaders());
        return result;
    }

    async getTaskSummaryData(details) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/task/summary?userId=" + res["STR_USERID"] + "&details=" + details, http.getDefaultHeaders());
        return result;
    }

    async getRSCUtilzationData(userId, summaryOption) {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/task/rcs_util?userId=" + userId + "&summary=" + summaryOption, http.getDefaultHeaders());
        return result;
    }

    async getTaskVerificationCommitData() {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/task/verification/commit?userId=" + res["STR_USERID"], http.getDefaultHeaders());
        return result;
    }

    async getTaskVerificationDeleteData() {
        const http = new httpOperations();
        let result = await http.httpGet(res["STR_BASEPATH"] + "/task/verification/delete?userId=" + res["STR_USERID"], http.getDefaultHeaders());
        return result;
    }

    async updateWorkflowToNextStateMulti(arrData) {
        const http = new httpOperations();
        let arrTaskToUpdate = [];
        for (let index = 0; index < arrData.length; index++) {
            const element = arrData[index];
            let body = {}
            body["taskId"] = element[7];
            body["userId"] = res["STR_USERID"];
            body["userName"] = res["STR_USERNAME"];
            body["updateType"] = "workflow";
            body["currentWorkflowState"] = element[8];
            body["newWorkflowState"] = await this.wf.getNextWorkflowStatus(element[8]);
            arrTaskToUpdate.push(body)
        }
        let result = await http.httpPut(res["STR_BASEPATH"] + "/task/activityworkflow", arrTaskToUpdate, http.getDefaultHeaders());
        return result;
    }

    async updateWorkflowToSpecificStateMulti(arrData, nextWorkflowState) {
        const http = new httpOperations();
        let arrTaskToUpdate = [];
        for (let index = 0; index < arrData.length; index++) {
            const element = arrData[index];
            let body = {}
            body["taskId"] = element[7];
            body["userId"] = res["STR_USERID"];
            body["userName"] = res["STR_USERNAME"];
            body["updateType"] = "workflow";
            body["currentWorkflowState"] = element[8];
            body["newWorkflowState"] = nextWorkflowState;
            arrTaskToUpdate.push(body)
        }
        let result = await http.httpPut(res["STR_BASEPATH"] + "/task/activityworkflow", arrTaskToUpdate, http.getDefaultHeaders());
        return result;
    }

    async updateWorkflowToSpecificState(taskData, currentState, newState) {
        const http = new httpOperations();
        console.log(newState)
        let body = {}
        body["taskId"] = taskData[1];
        body["userId"] = res["STR_USERID"];
        body["userName"] = res["STR_USERNAME"];
        body["updateType"] = "workflow";
        body["currentWorkflowState"] = currentState;
        body["newWorkflowState"] = newState;
        let result = await http.httpPut(res["STR_BASEPATH"] + "/task/activityworkflow", body, http.getDefaultHeaders());
        return result;
    }

    async TSKV_updateTaskToComplete_Multi(arrData) {
        for (let index = 0; index < arrData.length; index++) {
            let data = arrData[index];
            this.updateWorkflowToSpecificState(data, res["WORKFLOW"]["STR_WF_SELFCOMMIT"], res["WORKFLOW"]["STR_WF_COMPLETE"]);
        }
    }

    async TSKV_updateTaskToDelete_Multi(arrData) {
        for (let index = 0; index < arrData.length; index++) {
            let data = arrData[index];
            this.updateWorkflowToSpecificState(data, res["WORKFLOW"]["STR_WF_SELFDELETE"], res["WORKFLOW"]["STR_WF_DELETE"]);
        }
    }

    async TSKV_revertTask_Multi(arrData) {
        for (let index = 0; index < arrData.length; index++) {
            let data = arrData[index];
            this.updateWorkflowToSpecificState(data, data[4], res["WORKFLOW"]["STR_WF_INPROGRESS"]);
        }
    }

    // async deleteTask(id)
    // {
    //     const dbOps = new dbOperations();
    //     let condition = " \"TaskId\" = " + id;
    //     let result = dbOps.deleteData("Task_Master" , condition)
    //     return result
    // }



    getBlobDocFieldUpdateObj(data) {
        let obj = {};
        obj["userNameBy"] = res["STR_USERNAME"]
        obj["userId"] = res["STR_USERID"]
        obj["dateUpdated"] = util.getCurrentDateString();
        obj["updateType"] = "field"
        obj["fieldsUpdated"] = {}
        if ((data["Project"] != undefined) && (Object.keys(data["Project"]).length !== 0)) {
            obj["fieldsUpdated"]["Project"] = {}
            obj["fieldsUpdated"]["Project"]["OldProjectId"] = data["Project"]["OldProjectId"]
            obj["fieldsUpdated"]["Project"]["OldProjectName"] = data["Project"]["OldProject"]
            obj["fieldsUpdated"]["Project"]["NewProjectId"] = data["Project"]["NewProjectId"]
            obj["fieldsUpdated"]["Project"]["NewProjectName"] = data["Project"]["NewProject"]
        }
        if ((data["Module"] != undefined) && (Object.keys(data["Module"]).length !== 0)) {
            obj["fieldsUpdated"]["Module"] = {}
            obj["fieldsUpdated"]["Module"]["OldModule"] = data["Module"]["OldModule"]
            obj["fieldsUpdated"]["Module"]["NewModule"] = data["Module"]["NewModule"]
        }
        if ((data["Type"] != undefined) && (Object.keys(data["Type"]).length !== 0)) {
            obj["fieldsUpdated"]["Type"] = {}
            obj["fieldsUpdated"]["Type"]["OldType"] = data["Type"]["OldType"]
            obj["fieldsUpdated"]["Type"]["NewType"] = data["Type"]["NewType"]
        }
        if ((data["Priority"] != undefined) && (Object.keys(data["Priority"]).length !== 0)) {
            obj["fieldsUpdated"]["Priority"] = {}
            obj["fieldsUpdated"]["Priority"]["OldPriority"] = data["Priority"]["OldPriority"]
            obj["fieldsUpdated"]["Priority"]["NewPriority"] = data["Priority"]["NewPriority"]
        }
        if ((data["Owner"] != undefined) && (Object.keys(data["Owner"]).length !== 0)) {
            obj["fieldsUpdated"]["Owner"] = {}
            obj["fieldsUpdated"]["Owner"]["OldOwner"] = data["Owner"]["OldOwner"]
            obj["fieldsUpdated"]["Owner"]["OldOwnerId"] = data["Owner"]["OldOwnerId"]
            obj["fieldsUpdated"]["Owner"]["NewOwner"] = data["Owner"]["NewOwner"]
            obj["fieldsUpdated"]["Owner"]["NewOwnerId"] = data["Owner"]["NewOwnerId"]
        }
        if ((data["Assigner"] != undefined) && (Object.keys(data["Assigner"]).length !== 0)) {
            obj["fieldsUpdated"]["Assigner"] = {}
            obj["fieldsUpdated"]["Assigner"]["OldAssigner"] = data["Assigner"]["OldAssigner"]
            obj["fieldsUpdated"]["Assigner"]["OldAssignerId"] = data["Assigner"]["OldAssignerId"]
            obj["fieldsUpdated"]["Assigner"]["NewAssigner"] = data["Assigner"]["NewAssigner"]
            obj["fieldsUpdated"]["Assigner"]["NewAssignerId"] = data["Assigner"]["NewAssignerId"]
        }
        return obj;
    }

    async UpdateNewComment(taskId, data) {
        const http = new httpOperations();
        console.log(data)
        let body = {}
        body["taskId"] = taskId;
        body["userId"] = res["STR_USERID"];
        body["userName"] = res["STR_USERNAME"];
        body["updateType"] = "comment";
        body["data"] = data;
        let result = await http.httpPut(res["STR_BASEPATH"] + "/task/activityworkflow", body, http.getDefaultHeaders());
        return result;
    }

    async AddNewAttachment(taskId, commentData) {
        const http = new httpOperations();

        let fileData = document.getElementById('tskd-file-input').files[0];
        console.log(fileData)
        let body = new FormData();
        body.append(fileData.name, fileData)
        //body.append("UPLOADCARE_PUB_KEY", "a5ef62030b406923258c")
        body.append("UPLOADCARE_PUB_KEY", "0df57c1d7377e7482b0b")
        let result = await http.httpPostMultiartData("https://upload.uploadcare.com/base/", body, http.getDefaultMultipartHeaders());
        console.log(result)

        let metaData = {}
        metaData["taskId"] = taskId;
        metaData["userId"] = res["STR_USERID"];
        metaData["userName"] = res["STR_USERNAME"];
        metaData["updateType"] = "attachment";
        metaData["commentData"] = commentData;
        metaData["fileName"] = fileData.name;
        metaData["url"] = "https://ucarecdn.com/" + result[fileData.name] + "/";
        console.log(metaData)
        result = await http.httpPut(res["STR_BASEPATH"] + "/task/activityworkflow", metaData, http.getDefaultHeaders());
        return result;
    }


    async updateTaskFields(data) {
        const http = new httpOperations();
        console.log(data)
        let arrObj = []
        if ((data["Project"] != undefined) && (Object.keys(data["Project"]).length !== 0)) {
            let obj = {}
            obj["field"] = "Project"
            obj["fieldValue"] = data["Project"]["NewProjectId"]
            arrObj.push(obj);
        }
        if ((data["Module"] != {}) && (Object.keys(data["Module"]).length !== 0)) {
            let obj = {}
            obj["field"] = "Module"
            obj["fieldValue"] = data["Module"]["NewModule"]
            arrObj.push(obj);
        }
        if ((data["Type"] != undefined) && (Object.keys(data["Type"]).length !== 0)) {
            let obj = {}
            obj["field"] = "Type"
            obj["fieldValue"] = data["Type"]["NewType"]
            arrObj.push(obj);
        }
        if ((data["Priority"] != undefined) && (Object.keys(data["Priority"]).length !== 0)) {
            let obj = {}
            obj["field"] = "Priority"
            obj["fieldValue"] = data["Priority"]["NewPriority"]
            arrObj.push(obj);
        }
        if ((data["Owner"] != undefined) && (Object.keys(data["Owner"]).length !== 0)) {
            let obj = {}
            obj["field"] = "Owner"
            obj["fieldValue"] = data["Owner"]["NewOwnerId"]
            arrObj.push(obj);
        }
        if ((data["Assigner"] != undefined) && (Object.keys(data["Assigner"]).length !== 0)) {
            let obj = {}
            obj["field"] = "Assigner"
            obj["fieldValue"] = data["Assigner"]["NewAssignerId"]
            arrObj.push(obj);
        }

        console.log(arrObj)
        for (let index = 0; index < arrObj.length; index++) {
            let element = arrObj[index];
            element["taskId"] = data["TaskId"]
            element["userId"] = res["STR_USERID"]
            element["userName"] = res["STR_USERNAME"]
            await http.httpPut(res["STR_BASEPATH"] + "/task/" + data["TaskId"], element, http.getDefaultHeaders());
        }
    }

    async updateTaskFieldsForAccountDelete(data) {
        let arrColms = [];
        let arrValues = [];
        let conditionColumn = "";
        if ((data["Owner"] != undefined) && (Object.keys(data["Owner"]).length !== 0)) {
            arrColms.push("Owner");
            arrValues.push(data["Owner"]["NewOwnerId"]);
            conditionColumn = "Owner";
        }
        if ((data["Assigner"] != undefined) && (Object.keys(data["Assigner"]).length !== 0)) {
            arrColms.push("Assigner");
            arrValues.push(data["Assigner"]["NewAssignerId"]);
            conditionColumn = "Assigner";
        }

        arrColms = util.generateCustomWrapperArray("\"", arrColms)
        arrValues = util.generateCustomWrapperArray("\'", arrValues)
        const dbOps = new dbOperations();

        let columns = ["\"TaskId\""]
        let condition = " \"" + conditionColumn + "\" = '" + res["STR_USERID"] + "' AND \"TaskStatus\" IN ( '" + res["WORKFLOW"]["STR_WF_INPROGRESS"] + "','" + res["WORKFLOW"]["STR_WF_NEW"] + "','" + res["WORKFLOW"]["STR_WF_SELFCOMMIT"] + "','" + res["WORKFLOW"]["STR_WF_SELFDELETE"] + "')";
        let taskIdsData = await dbOps.getData("Task_Master", columns, condition, false)
        let taskData = taskIdsData["rows"];
        let arrTaskId = [];
        for (let index = 0; index < taskData.length; index++) {
            arrTaskId.push(taskData[index]["TaskId"])
        }

        if (arrTaskId.length != 0) {
            let arrId = util.generateCustomWrapperArray("\'", arrTaskId)
            condition = " \"TaskId\" IN (" + arrId + ")";
            let result = await dbOps.updateData("Task_Master", arrColms, arrValues, condition)

            for (let index = 0; index < arrTaskId.length; index++) {
                const id = arrTaskId[index];
                let obj = this.getBlobDocFieldUpdateObj(data);
                let query = { "TaskId": id }
                let taskData = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
                console.log(taskData)
                let activitySet = taskData["Activity"]
                activitySet.push(obj);
                console.log(obj)
                let updateObject = { conditionColumn: arrValues[0], "Activity": activitySet }
                let resultBlob = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
                console.log(resultBlob);
            }
        }

    }
}
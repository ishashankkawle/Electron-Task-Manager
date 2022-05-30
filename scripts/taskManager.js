let dbOperations = require('../core/databaseOperations');
let httpOperations = require('../core/httpHandler');
let res = require('../shared/resources');
let Workflow = require('../core/workflowOperations');
const Util = require('../core/util');

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
        //let arrData = tableObject.rows({ selected: true }).data().toArray();
        const http = new httpOperations();
        let arrTaskToUpdate = [];
        for (let index = 0; index < arrData.length; index++) {
            const element = arrData[index];
            let body = {}
            body["taskId"] = element[7];
            body["userId"] = res["STR_USERID"];
            body["userName"] = res["STR_USERNAME"];
            body["currentWorkflowState"] = element[8];
            body["newWorkflowState"] = await this.wf.getNextWorkflowStatus(element[8]);
            arrTaskToUpdate.push(body)
        }
        console.log(arrTaskToUpdate);
        let result = await http.httpPut(res["STR_BASEPATH"] + "/task/workflow", arrTaskToUpdate, http.getDefaultHeaders());
        return result;
    }

    async updateWorkflowToSpecificStateMulti(arrData, nextWorkflowState) {
        const http = new httpOperations();
        console.log(arrData)
        let arrTaskToUpdate = [];
        for (let index = 0; index < arrData.length; index++) {
            const element = arrData[index];
            let body = {}
            body["taskId"] = element[7];
            body["userId"] = res["STR_USERID"];
            body["userName"] = res["STR_USERNAME"];
            body["currentWorkflowState"] = element[8];
            body["newWorkflowState"] = nextWorkflowState;
            arrTaskToUpdate.push(body)
        }
        console.log(arrTaskToUpdate);
        let result = await http.httpPut(res["STR_BASEPATH"] + "/task/workflow", arrTaskToUpdate, http.getDefaultHeaders());
        return result;
    }

    async updateWorkflowToSpecificState(taskData, currentState, newState) {
        const http = new httpOperations();
        console.log(newState)
        let body = {}
        body["taskId"] = taskData[1];
        body["userId"] = res["STR_USERID"];
        body["userName"] = res["STR_USERNAME"];
        body["currentWorkflowState"] = currentState;
        body["newWorkflowState"] = newState;
        let result = await http.httpPut(res["STR_BASEPATH"] + "/task/workflow", body, http.getDefaultHeaders());
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

    // !!!!!!!!!!!!!!!!!!!!!!!!!!
    // PENDING CHANGE
    // !!!!!!!!!!!!!!!!!!!!!!!!!!

    getBlobDocWorkflowUpdateObj(oldWorkflow, newWorkflow) {
        let obj = {};
        obj["userNameBy"] = res["STR_USERNAME"]
        obj["userId"] = res["STR_USERID"]
        obj["dateUpdated"] = util.getCurrentDateString();
        obj["updateType"] = "workflow"
        obj["prevWorkflowState"] = oldWorkflow;
        obj["nextWorkflowState"] = newWorkflow;
        return obj;
    }

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

    async UpdateBlobTaskWithNewComment(taskId, data) {
        let obj = this.getBlobDocUpdateObj(data);
        const dbOps = new dbOperations();
        let query = { "TaskId": taskId }
        let taskData = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
        console.log(taskData);
        let activitySet = taskData["Activity"]
        activitySet.push(obj);
        let updateObject = { "Activity": activitySet }
        let result = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
        console.log(result);
    }

    async updateTaskFields(data) {
        let arrColms = [];
        let arrValues = [];

        if ((data["Project"] != undefined) && (Object.keys(data["Project"]).length !== 0)) {
            arrColms.push("ProjectId");
            arrValues.push(data["Project"]["NewProjectId"]);
        }
        if ((data["Module"] != undefined) && (Object.keys(data["Module"]).length !== 0)) {
            arrColms.push("Module");
            arrValues.push(data["Module"]["NewModule"]);
        }
        if ((data["Type"] != undefined) && (Object.keys(data["Type"]).length !== 0)) {
            arrColms.push("Type");
            arrValues.push(data["Type"]["NewType"]);
        }
        if ((data["Priority"] != undefined) && (Object.keys(data["Priority"]).length !== 0)) {
            arrColms.push("Priority");
            arrValues.push(data["Priority"]["NewPriority"]);
        }
        if ((data["Owner"] != undefined) && (Object.keys(data["Owner"]).length !== 0)) {
            arrColms.push("Owner");
            arrValues.push(data["Owner"]["NewOwnerId"]);
        }
        if ((data["Assigner"] != undefined) && (Object.keys(data["Assigner"]).length !== 0)) {
            arrColms.push("Assigner");
            arrValues.push(data["Assigner"]["NewAssignerId"]);
        }

        arrColms = util.generateCustomWrapperArray("\"", arrColms)
        arrValues = util.generateCustomWrapperArray("\'", arrValues)
        const dbOps = new dbOperations();
        let condition = " \"TaskId\" = " + data["TaskId"];
        let result = await dbOps.updateData("Task_Master", arrColms, arrValues, condition)

        let obj = this.getBlobDocFieldUpdateObj(data);
        console.log(obj)
        let query = { "TaskId": data["TaskId"] }
        let taskData = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
        let activitySet = taskData["Activity"]
        activitySet.push(obj);
        let updateObject = { "Activity": activitySet }
        let resultBlob = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
        console.log(resultBlob);
        return result;
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

    // !!!!!!!!!!!!!!!!!!!!!!!!!!
    // PENDING CHANGE
    // !!!!!!!!!!!!!!!!!!!!!!!!!!
}
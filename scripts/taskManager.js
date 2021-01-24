let dbOperations = require('../core/databaseOperations');
let res = require('../shared/resources');
let Workflow = require('../core/workflowOperations');
const Util = require('../core/util');

const util = new Util();


module.exports = class taskManager {
    constructor() {
        this.wf = new Workflow();
    }

    async getAllTaskData() {
        const dbOps = new dbOperations();
        let condition = "\"TaskOwner\" = " + "\'" + res["STR_USERID"] + "\'"
        let columnsToFetch = "*"
        let result = await dbOps.getData("View_TaskMaster", columnsToFetch, condition);
        return result["rows"];
    }

    async getSingleTaskData(taskId) {
        const dbOps = new dbOperations();
        //let condition = "\"TaskOwner\" = \'" + userId +"\' And \"TaskId\" = \'" + taskId + "\'"
        let condition = "\"TaskId\" = \'" + taskId + "\'"
        let columnsToFetch = "*"
        let result = await dbOps.getData("View_TaskMaster", columnsToFetch, condition);
        return result["rows"];
    }

    async getTaskActivityData(taskId) {
        const dbOps = new dbOperations();
        let query = { "TaskId": taskId }
        let result = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
        return result;
    }

    async getTaskSummaryData() {
        const dbOps = new dbOperations();
        let result = {};
        let condition = " \"TaskOwner\" = \'" + res["STR_USERID"] + "\'"
        let totalcount = await dbOps.getData("View_TaskMaster", "COUNT(*)", condition);
        let activeCondition = " \"TaskStatus\" IN ( \'New\' , \'In_Progress\') AND \"TaskOwner\" = \'" + res["STR_USERID"] + "\'";
        let completeCondition = " \"TaskStatus\"  = \'Complete\' AND \"TaskOwner\" = \'" + res["STR_USERID"] + "\'";
        let activeCount = await dbOps.getData("View_TaskMaster", "COUNT(*)", activeCondition);
        let completeCount = await dbOps.getData("View_TaskMaster", "COUNT(*)", completeCondition);
        if(totalcount["rows"] != undefined)
        {
            result["total"] = totalcount["rows"][0]["count"];
        }
        if(activeCount["rows"] != undefined)
        {
            result["active"] = activeCount["rows"][0]["count"];
        }
        if(completeCount["rows"] != undefined)
        {
            result["complete"] = completeCount["rows"][0]["count"];
        }
        let opt = "GROUP BY \"Module\"";
        let arrColms = [" \"Module\" ", "count(0)"];
        let moduleFragmentationData = await dbOps.getData("View_TaskMaster", arrColms, condition, false, opt);
        if(moduleFragmentationData["rows"] != undefined)
        {
            result["ModuleData"] = moduleFragmentationData["rows"];
        }
        return result;
    }

    async getTaskVerificationAssignmentSummary() {
        const dbOps = new dbOperations();
        let opt = "GROUP BY \"TaskStatus\"";
        let arrColms = [" \"TaskStatus\" ", "count(0)"];
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"] + "\'"
        let summaryData = await dbOps.getData("View_TaskMaster", arrColms, condition, false, opt);
        return summaryData["rows"];
    }

    async getTaskVerificationRSCUtilzationData() {
        const dbOps = new dbOperations();
        let opt = "GROUP BY \"OwnerName\"";
        let arrColms = [" \"OwnerName\" ", "count(0)"];
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"] + "\'"
        let rscData = await dbOps.getData("View_TaskMaster", arrColms, condition, false, opt);
        return rscData["rows"];
    }

    async getTaskVerificationAssignementData() {
        const dbOps = new dbOperations();
        let columnsToFetch = [" \"Title\" ", " \"DateTerminated\" ", " \"TaskStatus\" ", " \"OwnerName\" "]
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"] + "\'"
        let assignmentData = await dbOps.getData("View_TaskMaster", columnsToFetch, condition);
        return assignmentData["rows"];
    }

    async getTaskVerificationCommitData() {
        const dbOps = new dbOperations();
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"] + "\' AND \"TaskStatus\" = \'" + res["WORKFLOW"]["STR_WF_SELFCOMMIT"] + "\'"
        let arrColumns = [" \"TaskId\" ", " \"Title\" ", " \"Module\" "]
        let result = await dbOps.getData("View_TaskMaster", arrColumns, condition);
        return result["rows"];
    }

    async getTaskVerificationDeleteData() {
        const dbOps = new dbOperations();
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"] + "\' AND \"TaskStatus\" = \'" + res["WORKFLOW"]["STR_WF_SELFDELETE"] + "\'"
        let arrColumns = [" \"TaskId\" ", " \"Title\" ", " \"Module\" "]
        let result = await dbOps.getData("View_TaskMaster", arrColumns, condition);
        return result["rows"];
    }

    async updateNextTaskWorkflowState(tableObject) {
        let arrData = tableObject.rows({ selected: true }).data().toArray();
        const dbOps = new dbOperations();
        let arrColms = [" \"TaskStatus\" "];

        for (let index = 0; index < arrData.length; index++) {
            const element = arrData[index];
            console.log(element);
            let taskId = element[7];
            let wfState = await this.wf.getNextWorkflowStatus(element[8]);
            let arrValues = ["\'" + wfState + "\'"];
            let condition = " \"TaskId\" = " + taskId;
            let result = await dbOps.updateData("Task_Master", arrColms, arrValues, condition)
            console.log(result);

            let query = { "TaskId": taskId }
            let obj = this.getBlobDocWorkflowUpdateObj(element[8], wfState)
            let taskData = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
            let activitySet = taskData["Activity"]
            activitySet.push(obj);
            let updateObject = { "Activity": activitySet, "TaskStatus": wfState }
            let resultBlob = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
            console.log(resultBlob);

        }
    }

    async updateTaskWorkflowStateToSelfCommit(tableObject) {
        let arrData = tableObject.rows({ selected: true }).data().toArray();
        const dbOps = new dbOperations();
        let arrColms = [" \"TaskStatus\" "];
        for (let index = 0; index < arrData.length; index++) {
            const element = arrData[index];
            let taskId = element[7];
            let wfState = res["WORKFLOW"]["STR_WF_SELFCOMMIT"]
            let arrValues = ["\'" + wfState + "\'"];
            let condition = " \"TaskId\" = " + taskId;
            let result = await dbOps.updateData("Task_Master", arrColms, arrValues, condition)
            console.log(result);

            let query = { "TaskId": taskId }
            let obj = this.getBlobDocWorkflowUpdateObj(element[8], wfState)
            let taskData = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
            let activitySet = taskData["Activity"]
            activitySet.push(obj);
            let updateObject = { "Activity": activitySet, "TaskStatus": wfState }
            let resultBlob = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
            console.log(resultBlob);
        }
    }

    async updateTaskWorkflowStateToSelfDelete(tableObject) {
        let arrData = tableObject.rows({ selected: true }).data().toArray();
        const dbOps = new dbOperations();
        let arrColms = [" \"TaskStatus\" "];
        for (let index = 0; index < arrData.length; index++) {
            const element = arrData[index];
            let taskId = element[7];
            let wfState = res["WORKFLOW"]["STR_WF_SELFDELETE"]
            let arrValues = ["\'" + wfState + "\'"];
            let condition = " \"TaskId\" = " + taskId;
            let result = await dbOps.updateData("Task_Master", arrColms, arrValues, condition)
            console.log(result);

            let query = { "TaskId": taskId }
            let obj = this.getBlobDocWorkflowUpdateObj(element[8], wfState)
            let taskData = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
            let activitySet = taskData["Activity"]
            activitySet.push(obj);
            let updateObject = { "Activity": activitySet, "TaskStatus": wfState }
            let resultBlob = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
            console.log(resultBlob);
        }
    }

    async TSKV_updateTaskToComplete(taskData) {
        const dbOps = new dbOperations();
        let taskId = taskData[1];
        let arrColms = ["TaskStatus"];
        arrColms = util.generateCustomWrapperArray("\"", arrColms)
        let wfState = res["WORKFLOW"]["STR_WF_COMPLETE"]
        let arrValues = [wfState];
        arrValues = util.generateCustomWrapperArray("\'", arrValues)
        let condition = " \"TaskId\" = " + taskId;
        let result = await dbOps.updateData("Task_Master", arrColms, arrValues, condition)
        console.log(result);

        let query = { "TaskId": taskId }
        let obj = this.getBlobDocWorkflowUpdateObj(res["WORKFLOW"]["STR_WF_SELFCOMMIT"], wfState)
        let taskBlobData = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
        let activitySet = taskBlobData["Activity"]
        activitySet.push(obj);
        let updateObject = { "Activity": activitySet, "TaskStatus": wfState }
        let resultBlob = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
        console.log(resultBlob);
    }

    async TSKV_updateTaskToDelete(taskData) {
        const dbOps = new dbOperations();
        let taskId = taskData[1];
        let arrColms = ["TaskStatus"];
        arrColms = util.generateCustomWrapperArray("\"", arrColms)
        let wfState = res["WORKFLOW"]["STR_WF_DELETE"]
        let arrValues = [wfState];
        arrValues = util.generateCustomWrapperArray("\'", arrValues)
        let condition = " \"TaskId\" = " + taskId;
        let result = await dbOps.updateData("Task_Master", arrColms, arrValues, condition)
        console.log(result);

        let query = { "TaskId": taskId }
        let obj = this.getBlobDocWorkflowUpdateObj(res["WORKFLOW"]["STR_WF_SELFDELETE"], wfState)
        let taskBlobData = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
        let activitySet = taskBlobData["Activity"]
        activitySet.push(obj);
        let updateObject = { "Activity": activitySet, "TaskStatus": wfState }
        let resultBlob = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
        console.log(resultBlob);
    }

    async TSKV_revertTask(taskData) {
        const dbOps = new dbOperations();
        let taskId = taskData[1];
        let arrColms = ["TaskStatus"];
        arrColms = util.generateCustomWrapperArray("\"", arrColms)
        let wfState = res["WORKFLOW"]["STR_WF_INPROGRESS"]
        let arrValues = [wfState];
        arrValues = util.generateCustomWrapperArray("\'", arrValues)
        let condition = " \"TaskId\" = " + taskId;
        let result = await dbOps.updateData("Task_Master", arrColms, arrValues, condition)
        console.log(result);

        let query = { "TaskId": taskId }
        let taskBlobData = await dbOps.getBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query);
        let activitySet = taskBlobData["Activity"]
        let obj = this.getBlobDocWorkflowUpdateObj(taskBlobData["TaskStatus"], wfState)
        activitySet.push(obj);
        let updateObject = { "Activity": activitySet, "TaskStatus": wfState }
        let resultBlob = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
        console.log(resultBlob);
    }

    async TSKV_updateTaskToComplete_Multi(tableObject) {
        let arrData = tableObject.rows({ selected: true }).data().toArray();
        for (let index = 0; index < arrData.length; index++) {
            let data = arrData[index];
            this.TSKV_updateTaskToComplete(data);
        }
    }

    async TSKV_updateTaskToDelete_Multi(tableObject) {
        let arrData = tableObject.rows({ selected: true }).data().toArray();
        for (let index = 0; index < arrData.length; index++) {
            let data = arrData[index];
            this.TSKV_updateTaskToDelete(data);
        }
    }

    async TSKV_revertTask_Multi(tableObject) {
        let arrData = tableObject.rows({ selected: true }).data().toArray();
        for (let index = 0; index < arrData.length; index++) {
            let data = arrData[index];
            this.TSKV_revertTask(data);
        }
    }

    // async deleteTask(id)
    // {
    //     const dbOps = new dbOperations();
    //     let condition = " \"TaskId\" = " + id;
    //     let result = dbOps.deleteData("Task_Master" , condition)
    //     return result
    // }



    getBlobDocUpdateObj(data) {
        let obj = {};
        obj["userNameBy"] = res["STR_USERNAME"]
        obj["userId"] = res["STR_USERID"]
        obj["dateUpdated"] = util.getCurrentDateString();
        obj["updateType"] = "comment"
        obj["activityData"] = data;
        return obj;
    }

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
                let updateObject = { conditionColumn : arrValues[0] , "Activity": activitySet }
                let resultBlob = dbOps.updateBlobData(res["STR_BLOBDBNAME"], res["STR_BLOBDBCOLLECTIONAME"], query, updateObject);
                console.log(resultBlob);
            }
        }

    }

    async getTaskByAssigner(assignerId) {
        const dbOps = new dbOperations();
        let condition = "\"TaskAssigner\" = " + "\'" + assignerId + "\'"
        let columnsToFetch = "*"
        let result = await dbOps.getData("View_TaskMaster", columnsToFetch, condition);
        return result["rows"];
    }

    async getTaskByOwner(ownerId) {
        const dbOps = new dbOperations();
        let condition = "\"TaskOwner\" = " + "\'" + ownerId + "\'"
        let columnsToFetch = "*"
        let result = await dbOps.getData("View_TaskMaster", columnsToFetch, condition);
        return result["rows"];
    }

}
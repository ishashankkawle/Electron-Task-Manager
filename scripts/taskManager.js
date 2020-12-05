let dbOperations = require('../core/databaseOperations');
let res = require('../shared/resources');
let Workflow = require('../core/workflowOperations');


module.exports = class taskManager 
{
    constructor()
    {
        this.wf = new Workflow();
    }

    async getAllTaskData()
    {
        const dbOps = new dbOperations();
        let condition = "\"TaskOwner\" = " + "\'"+res["STR_USERID"] +"\'"
        let columnsToFetch = "*"
        let result= await dbOps.getData("View_TaskMaster" , columnsToFetch , condition);
        return result["rows"];
    }

    async getSingleTaskData(userId , taskId)
    {
        const dbOps = new dbOperations();
        let condition = "\"TaskOwner\" = \'" + userId +"\' And \"TaskId\" = \'" + taskId + "\'"
        let columnsToFetch = "*"
        let result= await dbOps.getData("View_TaskMaster" , columnsToFetch , condition);
        return result["rows"];
    }

    async getTaskSummaryData()
    {
        const dbOps = new dbOperations();
        let result = {};
        let condition = " \"TaskOwner\" = \'" + res["STR_USERID"]+"\'"
        let totalcount= await dbOps.getData("View_TaskMaster" , "COUNT(*)" ,condition );
        let activeCondition = " \"TaskStatus\" IN ( \'New\' , \'In_Progress\') AND \"TaskOwner\" = \'" + res["STR_USERID"]+"\'";
        let completeCondition = " \"TaskStatus\"  = \'Complete\' AND \"TaskOwner\" = \'" + res["STR_USERID"]+"\'";
        let activeCount= await dbOps.getData("View_TaskMaster" , "COUNT(*)" , activeCondition);
        let completeCount= await dbOps.getData("View_TaskMaster" , "COUNT(*)" , completeCondition);
        result["total"] = totalcount["rows"][0]["count"];
        result["active"] = activeCount["rows"][0]["count"];
        result["complete"] = completeCount["rows"][0]["count"];
        let opt = "GROUP BY \"Module\"";
        let arrColms = [" \"Module\" " , "count(0)"];
        let moduleFragmentationData = await dbOps.getData("View_TaskMaster" ,arrColms , condition , opt);
        result["ModuleData"] = moduleFragmentationData["rows"];
        return result;
    }

    async getTaskVerificationAssignmentSummary()
    {
        const dbOps = new dbOperations();
        let opt = "GROUP BY \"TaskStatus\"";
        let arrColms = [" \"TaskStatus\" " , "count(0)"];
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"]+"\'"
        let summaryData = await dbOps.getData("View_TaskMaster" ,arrColms , condition , opt);
        return summaryData["rows"];
    }

    async getTaskVerificationRSCUtilzationData()
    {
        const dbOps = new dbOperations();
        let opt = "GROUP BY \"OwnerName\"";
        let arrColms = [" \"OwnerName\" " , "count(0)"];
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"]+"\'"
        let rscData = await dbOps.getData("View_TaskMaster" ,arrColms , condition , opt);
        return rscData["rows"];
    }

    async getTaskVerificationAssignementData()
    {
        const dbOps = new dbOperations();
        let columnsToFetch = [" \"Title\" "," \"DateTerminated\" "," \"TaskStatus\" "," \"OwnerName\" "]
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"]+"\'"
        let assignmentData = await dbOps.getData("View_TaskMaster" ,columnsToFetch , condition );
        return assignmentData["rows"];
    }

    async getTaskVerificationCommitData()
    {
        const dbOps = new dbOperations();
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"]+"\' AND \"TaskStatus\" = \'" + res["WORKFLOW"]["STR_WF_SELFCOMMIT"] + "\'"
        let arrColumns = [" \"TaskId\" " , " \"Title\" " , " \"Module\" "]
        let result = await dbOps.getData("View_TaskMaster" , arrColumns , condition);
        return result["rows"];
    }

    async getTaskVerificationDeleteData()
    {
        const dbOps = new dbOperations();
        let condition = " \"TaskAssigner\" = \'" + res["STR_USERID"]+"\' AND \"TaskStatus\" = \'" + res["WORKFLOW"]["STR_WF_SELFDELETE"] + "\'"
        let arrColumns = [" \"TaskId\" " , " \"Title\" " , " \"Module\" "]
        let result = await dbOps.getData("View_TaskMaster" , arrColumns , condition);
        return result["rows"];
    }

    async updateNextTaskWorkflowState( tableObject )
    {
        let arrData = tableObject.rows( { selected: true } ).data().toArray();
        const dbOps = new dbOperations();
        let arrColms = [" \"TaskStatus\" "];
        
        for (let index = 0; index < arrData.length; index++) 
        {
            const element = arrData[index];
            console.log(element);
            let taskId = element[7];
            let wfState = await this.wf.getNextWorkflowStatus(element[8]);
            let arrValues = ["\'" + wfState + "\'"];
            let condition = " \"TaskId\" = " + taskId;
            let result = await dbOps.updateData("Task_Master" , arrColms , arrValues , condition)
            console.log(result);
        }
    }

    async updateTaskWorkflowStateToSelfCommit(tableObject)
    {
        let arrData = tableObject.rows( { selected: true } ).data().toArray();
        const dbOps = new dbOperations();
        let arrColms = [" \"TaskStatus\" "];
        for (let index = 0; index < arrData.length; index++) 
        {
            const element = arrData[index];
            let taskId = element[7];
            let wfState = res["WORKFLOW"]["STR_WF_SELFCOMMIT"]
            let arrValues = ["\'" + wfState + "\'"];
            let condition = " \"TaskId\" = " + taskId;
            let result = await dbOps.updateData("Task_Master" , arrColms , arrValues , condition)
            console.log(result);
        }
    }

    async updateTaskWorkflowStateToSelfDelete(tableObject)
    {
        let arrData = tableObject.rows( { selected: true } ).data().toArray();
        const dbOps = new dbOperations();
        let arrColms = [" \"TaskStatus\" "];
        for (let index = 0; index < arrData.length; index++) 
        {
            const element = arrData[index];
            let taskId = element[7];
            let wfState = res["WORKFLOW"]["STR_WF_SELFDELETE"]
            let arrValues = ["\'" + wfState + "\'"];
            let condition = " \"TaskId\" = " + taskId;
            let result = await dbOps.updateData("Task_Master" , arrColms , arrValues , condition)
            console.log(result);
        }
    }

    async TSKV_updateTaskToComplete(taskData)
    {
        console.log(taskData);
        const dbOps = new dbOperations();
        let taskId = taskData[1];
        let arrColms = [" \"TaskStatus\" "];
        let wfState = res["WORKFLOW"]["STR_WF_COMPLETE"]
        let arrValues = ["\'" + wfState + "\'"];
        let condition = " \"TaskId\" = " + taskId;
        let result = await dbOps.updateData("Task_Master" , arrColms , arrValues , condition)
        console.log(result);
    }

    async TSKV_updateTaskToDelete(taskData)
    {
        console.log(taskData);
        const dbOps = new dbOperations();
        let taskId = taskData[1];
        let arrColms = [" \"TaskStatus\" "];
        let wfState = res["WORKFLOW"]["STR_WF_DELETE"]
        let arrValues = ["\'" + wfState + "\'"];
        let condition = " \"TaskId\" = " + taskId;
        let result = await dbOps.updateData("Task_Master" , arrColms , arrValues , condition)
        console.log(result);
    }

    async TSKV_revertTask(taskData)
    {
        console.log(taskData);
        const dbOps = new dbOperations();
        let taskId = taskData[1];
        let arrColms = [" \"TaskStatus\" "];
        let wfState = res["WORKFLOW"]["STR_WF_INPROGRESS"]
        let arrValues = ["\'" + wfState + "\'"];
        let condition = " \"TaskId\" = " + taskId;
        let result = await dbOps.updateData("Task_Master" , arrColms , arrValues , condition)
        console.log(result);
    }

    async TSKV_updateTaskToComplete_Multi(tableObject)
    {
        let arrData = tableObject.rows( { selected: true } ).data().toArray();
        console.log(arrData);
        for (let index = 0; index < arrData.length; index++) 
        {
            let data = arrData[index];
            this.TSKV_updateTaskToComplete(data);
        }
    }

    async TSKV_updateTaskToDelete_Multi(tableObject)
    {
        let arrData = tableObject.rows( { selected: true } ).data().toArray();
        console.log(arrData);
        for (let index = 0; index < arrData.length; index++) 
        {
            let data = arrData[index];
            this.TSKV_updateTaskToDelete(data);
        }
    }

    async TSKV_revertTask_Multi(tableObject)
    {
        let arrData = tableObject.rows( { selected: true } ).data().toArray();
        console.log(arrData);
        for (let index = 0; index < arrData.length; index++) 
        {
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


}
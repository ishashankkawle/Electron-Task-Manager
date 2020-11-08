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
        return result;
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

    async updateNextTaskWorkflowState( tableObject )
    {
        let arrData = tableObject.rows( { selected: true } ).data().toArray();
        const dbOps = new dbOperations();
        let arrColms = [" \"TaskStatus\" "];
        
        for (let index = 0; index < arrData.length; index++) 
        {
            const element = arrData[index];
            let taskId = element[8];
            let wfState = await this.wf.getNextWorkflowStatus(element[9]);
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
            let taskId = element[8];
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
            let taskId = element[8];
            let wfState = res["WORKFLOW"]["STR_WF_SELFDELETE"]
            let arrValues = ["\'" + wfState + "\'"];
            let condition = " \"TaskId\" = " + taskId;
            let result = await dbOps.updateData("Task_Master" , arrColms , arrValues , condition)
            console.log(result);
        }
    }

    async deleteTask(id)
    {
        const dbOps = new dbOperations();
        let condition = " \"TaskId\" = " + id;
        let result = dbOps.deleteData("Task_Master" , condition)
        return result
    }


}
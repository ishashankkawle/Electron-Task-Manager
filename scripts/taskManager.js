let dbOperations = require('../core/databaseOperations');
let res = require('../shared/resources');


module.exports = class taskManager 
{
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
        let completeCondition = " \"TaskStatus\"  = \'Completed\' AND \"TaskOwner\" = \'" + res["STR_USERID"]+"\'";
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

    async updateTask(id , state)
    {
        const dbOps = new dbOperations();
        let arrColms = [" \"TaskStatus\" "];
        let arrValues = [state];
        let condition = " \"TaskId\" = " + id;
        let result = dbOps.updateData("Task_Master" , arrColms , arrValues , condition)
        return result
    }

    async deleteTask(id)
    {
        const dbOps = new dbOperations();
        let condition = " \"TaskId\" = " + id;
        let result = dbOps.deleteData("Task_Master" , condition)
        return result
    }
}
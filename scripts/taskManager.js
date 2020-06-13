let dbOperations = require('../core/databaseOperations');

module.exports = class taskManager 
{
    async getAllTaskData()
    {
        const dbOps = new dbOperations();
        let result= await dbOps.getAllData("Task_Master");
        return result;
    }

    async getTaskSummaryData()
    {
        const dbOps = new dbOperations();
        let result = {};
        let totalcount= await dbOps.getData("Task_Master" , "COUNT(*)");
        let activeCondition = " \"TaskStatus\" IN ( \'New\' , \'In_Progress\') ";
        let completeCondition = " \"TaskStatus\"  = \'Completed\' ";
        let activeCount= await dbOps.getData("Task_Master" , "COUNT(*)" , activeCondition);
        let completeCount= await dbOps.getData("Task_Master" , "COUNT(*)" , completeCondition);
        result["total"] = totalcount["rows"][0]["count"];
        result["active"] = activeCount["rows"][0]["count"];
        result["complete"] = completeCount["rows"][0]["count"];
        let opt = "GROUP BY \"Module\"";
        let arrColms = [" \"Module\" " , "count(0)"];
        let moduleFragmentationData = await dbOps.getData("Task_Master" ,arrColms , "" , opt);
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
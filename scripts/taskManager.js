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
        result["total"]= await dbOps.getData("Task_Master" , "COUNT(*)");
        let activeCondition = " \"TaskStatus\" IN ( \"New\" , \"In_Progress\") ";
        let completeCondition = " \"TaskStatus\"  = \"Completed\" ";
        result["active"]= await dbOps.getData("Task_Master" , "COUNT(*)" , activeCondition);
        result["complete"]= await dbOps.getData("Task_Master" , "COUNT(*)" , completeCondition);
        console.log(result);
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
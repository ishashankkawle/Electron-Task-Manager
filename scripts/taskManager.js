let dbOperations = require('../core/databaseOperations');

module.exports = class taskManager 
{
    async getHomeScreenData()
    {
        const dbOps = new dbOperations();
        let result= await dbOps.getAllData("Task_Master");
        return result;
    }
}
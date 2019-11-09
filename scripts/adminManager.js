let dbOperations = require('../core/dbOperations');

module.exports = class adminManager {

    async saveTask() {
        try {
            let data = [];
            //const exl = new XL();
            const dbOps = new dbOperations();

            data.push(document.getElementById('TaskView-Module').value);
            data.push(document.getElementById('TaskView-Title').value);
            data.push(document.getElementById('TaskView-Description').value);
            data.push(document.getElementById('TaskView-ETA').value);
            data.push(document.getElementById('TaskView-Owner').value);
            data.push(document.getElementById('TaskView-Assign').value);
            data.push(document.getElementById('TaskView-Type').value);
            data.push(document.getElementById('TaskView-Priority').value);
            data.push(document.getElementById('TaskView-Order').value);

            //await InsertTaskInExcel(data, xlWorkbook);
            await this.insertTaskIntoDatabase(data, dbOps);
            //await getDataFromDatabase(dbOps);
        }
        catch (error) {
            console.log("Error due to : " + error);
        }

    }

    async saveUser()
    {
        try {
            let data = [];
            const dbOps = new dbOperations();

            data.push(document.getElementById('UserView-Name').value);
            data.push(document.getElementById('UserView-UserId').value);
            data.push(document.getElementById('UserView-Contact').value);
            data.push(document.getElementById('UserView-DOB').value);
            data.push(document.getElementById('UserView-Email').value);
            data.push(document.getElementById('UserView-UserName').value);
            data.push(document.getElementById('UserView-Password').value);
           

            await this.insertUserIntoDatabase(data, dbOps);
        } catch (error) {
            console.log("Error due to : " + error);
        }
    }

    async saveModule()
    {
        try 
        {
            let data = [];
            const dbOps = new dbOperations();
            data.push(document.getElementById('AssetView-Module').value);
            await this.insertAssetIntoDatabase("Module", data, dbOps);
        } catch (error) {
            console.log("Error due to : " + error);
        }
    }

    async saveType()
    {
        try 
        {
            let data = [];
            const dbOps = new dbOperations();
            data.push(document.getElementById('AssetView-Type').value);
            await this.insertAssetIntoDatabase("Type", data, dbOps);
        } catch (error) {
            console.log("Error due to : " + error);
        }
    }

    async savePriority()
    {
        try 
        {
            let data = [];
            const dbOps = new dbOperations();
            data.push(document.getElementById('AssetView-Priority').value);
            await this.insertAssetIntoDatabase("Priority", data, dbOps);
        } catch (error) {
            console.log("Error due to : " + error);
        }
    }

    async insertAssetIntoDatabase(asset , arrData , dbOps)
    {
        let db = dbOps.initialize(res["firebaseConfig"]);
        let keys = [asset]
        let objData = util.generateJSONObject(keys, arrData);
        dbOps.insertData(objData, asset, db);
    }

    async insertUserIntoDatabase(arrData, dbOps) {
        let db = dbOps.initialize(res["firebaseConfig"]);
        let keys = ["Name", "UserId", "Contact", "DOB", "Email", "UserName", "Password"]
        let objData = util.generateJSONObject(keys, arrData);
        dbOps.insertData(objData, "User", db);
    }

    async insertTaskIntoDatabase(arrData, dbOps) {
        let db = dbOps.initialize(res["firebaseConfig"]);
        let keys = ["Module", "Title", "Description", "ETA", "Owner", "Assign", "Type", "Priority", "Order"]
        let objData = util.generateJSONObject(keys, arrData);
        dbOps.insertData(objData, "Task", db);
    }

    async getDataFromDatabase(dbOps) {
        let db = dbOps.initialize(res["firebaseConfig"]);
        console.log(dbOps.readAllData("Task", db));
    }

}
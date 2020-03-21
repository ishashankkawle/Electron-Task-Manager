let dbOperations = require('../core/databaseOperations');

module.exports = class adminManager {

    async saveTask() 
    {
        try 
        {
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

            let keys = ["TaskId" , "Module", "Title", "Description", "DateTerminated", "Owner", "Assign", "Type", "Priority", "Order"];

            //await InsertTaskInExcel(data, xlWorkbook);
            await this.saveObject("Task_master" , keys , data , dbOps);
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
            //data.push(document.getElementById('UserView-UserId').value);
            data.push(document.getElementById('UserView-Contact').value);
            data.push(document.getElementById('UserView-DOB').value);
            data.push(document.getElementById('UserView-Email').value);
            data.push(document.getElementById('UserView-UserName').value);
            data.push(document.getElementById('UserView-Password').value);
           
            let keys = [ "UserId", "Name", "Contact", "DOB", "Email", "UserName", "Password"]
            let arrEncryptedCols = [4,5];
            //await this.insertUserIntoDatabase(data, dbOps);
            await this.saveObject("User_master" , keys , data, dbOps , true ,arrEncryptedCols);

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
            let keys = ["ModuleId","Module"];
            await this.saveObject("Module_master", keys, data, dbOps);
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
            let keys = ["TypeId","Type"];
            await this.saveObject("Type_master", keys, data, dbOps);
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
            let keys = ["PriorityId","Priority"];
            await this.saveObject("Priority_master",keys,  data, dbOps);
        } catch (error) {
            console.log("Error due to : " + error);
        }
    }


    async saveObject(type , keys , arrData , dbOps , isEncrypted , arrEncrypted)
    {
        // let db = dbOps.initialize(res["firebaseConfig"]);
        // let objData = util.generateJSONObject(keys, arrData);
        if(isEncrypted)
        {
            dbOps.addEncryptedData(type , keys , arrData , arrEncrypted)
        }   
        else
        {
            dbOps.addData(type , keys , arrData)
        }
        
    }

    
    async getDataFromDatabase(dbOps) {
        let db = dbOps.initialize(res["firebaseConfig"]);
        console.log(dbOps.readAllData("Task", db));
    }

}
let pg = require('pg');
let res = require('../shared/resources');
let Util = require('../core/util');

const util = new Util();


module.exports = class dbOps
{
    getDatabaseClient()
    {
        return new pg.Client(res["PostgresConnection"]);
    }

    async getAllData(tableName , client)
    {
        let query = "SELECT * FROM " + tableName

        if(client == undefined)
        {
            client = new pg.Client(res["PostgresConnection"]);
        }

        let result = await this.executeQuery(query , client);
        return result;
    }

    async getData(tableName , arrColumns , condition , options, client)
    {
        let query ="SELECT " + arrColumns.toString() + " FROM " + tableName;

        if(client == undefined)
        {
            client = new pg.Client(res["PostgresConnection"]);
        }

        if(condition !== undefined && condition !== "")
        {
            query = query + " WHERE " + condition;
        }

        if(options !== undefined)
        {
            query = query + " " + options;
        }

        console.log("QUERY : " + query);
        let result = await this.executeQuery(query , client);
        console.log(result);
        return result;
    }

    async executeQuery(query , client)
    {
        let response;
        client.connect();
        await client.query(query).then((result)=>{response = result;}).catch((error)=>{response = error;});
        client.end();
        return response
    }

    async addData(tableName , inputColumn , inputData , client)
    {
        var query = "INSERT INTO " + tableName + "(" + inputColumn +") VALUES (" + inputData + " )";

        if(client == undefined)
        {
            client = new pg.Client(res["PostgresConnection"]);
        }

        console.log(query);
        var result = this.executeQuery (query , client);
        return result;
    }

    async updateData(tableName , arrColumns , arrValues , condition , client)
    {
        let query = "Update " + tableName + " Set ";
        
        if(client == undefined)
        {
            client = new pg.Client(res["PostgresConnection"]);
        }

        let updateString = ""
        for (let index = 0; index < arrColumns.length; index++) 
        {
            updateString = updateString + arrColumns[index] + " = " + arrValues[index] + " , "
        }

        updateString = updateString.trim();
        updateString = updateString.substr(0 , updateString.length - 1);
        query = query + updateString;

        if(condition !== undefined)
        {
            query = query + " WHERE " + condition;
        }
        console.log("UPDATE QUERY : " + query);
        let result = await this.executeQuery(query , client);
        console.log(result);
        return result;
    }

    async deleteData(tableName , condition , client)
    {
        let query = ""
        if(condition == undefined)
        {
            query = "TRUNCATE TABLE " + tableName;
        }
        else
        {   
            query = "DELETE FROM " + tableName + " WHERE " + condition
        }

        if(client == undefined)
        {
            client = new pg.Client(res["PostgresConnection"]);
        }

        console.log(query);
        let result = await this.executeQuery(query , client);
        return result;
    }
}
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

    addData(tableName , inputColumn , inputData , client)
    {
        var query = "INSERT INTO " + tableName + "(" + util.generateCustomArrayString("\"" , inputColumn) + ", \"DateCreated\") VALUES (nextval('master_db_id_sequence') , " + util.generateCustomArrayString("\'" , inputData) + " , current_timestamp)";

        if(client == undefined)
        {
            client = new pg.Client(res["PostgresConnection"]);
        }

        var result = this.executeQuery (query , client);
        console.log(result);
    }

    addEncryptedData(tableName , inputColumn , inputData , arrEncryptedColumnIndex , client)
    {
        if(client == undefined)
        {
            client = new pg.Client(res["PostgresConnection"]);
        }

        var query = "INSERT INTO " + tableName + "(" + util.generateCustomArrayString("\"" , inputColumn) + ", \"DateCreated\") VALUES (nextval('master_db_id_sequence') , ";

        for (let index = 0; index < inputData.length; index++) 
        {
            let flag = false;
            for (let enc_index = 0; enc_index < arrEncryptedColumnIndex.length; enc_index++) 
            {
                if(index == arrEncryptedColumnIndex[enc_index])
                {
                    flag = true;
                }
            }

            let element = inputData[index];

            if(flag == true)
            {
                query = query + " PGP_SYM_ENCRYPT( '" + element + "' , 'AES_KEY') ,"
            }
            else
            {
                query = query + " '" + element + "' ,"        
            }    
        }
        query = query + " current_timestamp)"
        this.executeQuery(query , client);
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

    async getData(tableName , arrColumns , condition , opions, client)
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

        if(opions !== undefined)
        {
            query = query + " " + opions;
        }

        let result = await this.executeQuery(query , client);
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
        let result = await this.executeQuery(query , client);
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
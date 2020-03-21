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
        //console.log("cols = "+ util.generateCustomArrayString("\"" , inputColumn))
        var query = "INSERT INTO " + tableName + "(" + util.generateCustomArrayString("\"" , inputColumn) + ", \"DateCreated\") VALUES (nextval('master_db_id_sequence') , " + util.generateCustomArrayString("\'" , inputData) + " , current_timestamp)";

        console.log(query);
        //console.log(inputColumn.toString());

        if(client == undefined)
        {
            client = new pg.Client(res["PostgresConnection"]);
        }

        this.executeQuery (query , client);
        
    }

    addEncryptedData(tableName , inputColumn , inputData , arrEncryptedColumnIndex , client)
    {
        if(client == undefined)
        {
            client = new pg.Client(res["PostgresConnection"]);
        }

        var query = "INSERT INTO " + tableName + "(" + util.generateCustomArrayString("\"" , inputColumn) + ", \"DateCreated\") VALUES (nextval('master_db_id_sequence') , ";

        console.log(arrEncryptedColumnIndex.toString());

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

        //query = query.substring(0,query.length - 1)
        query = query + " current_timestamp)"
        console.log(query); 
        this.executeQuery(query , client);
    }

    executeQuery(query , client)
    {
        client.connect(function(err) 
        {
            if(err) 
            {
              return console.error('could not connect to postgres', err);
            }
            client.query(query, function(err, result) 
            {
                if(err) {
                  return console.error('error running query', err);
                }
                else
                {
                    return result;
                }
                client.end();
            }); 
        });
    }

}
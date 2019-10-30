module.exports = class Util 
{
    checkFileExist(FILE_PATH , FILE_NAME) 
    {
        try {
            return new Promise((resolve, reject) => {
                fs.access(FILE_PATH + FILE_NAME, fs.constants.F_OK, (err) => {
                    let obj = true;
                    if (err != null) {
                        obj = false;
                    }
                    resolve(obj);
                });
            });
        }
        catch (error) {
            console.log("Error due to : " + error);
        }

    }

    generateJSONObject(arrKey , arrValue)
    {
        if(arrKey.length !== arrValue.length)
        {
            return;
        }
        let objJSON = {};
        for(let index = 0; index < arrKey.length; index++)
        {
            objJSON[arrKey[index]] = arrValue[index];
        }
        return objJSON;
    }
}
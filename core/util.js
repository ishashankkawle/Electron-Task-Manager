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

    generateCustomArrayString(wrapper , arr)
    {
        let str="";

        if(arr.length == 1)
        {
            return wrapper+arr[0]+wrapper
        }

        for (let index = 0; index < (arr.length)-1; index++) 
        {
            if(index == 0)
            {
                str = wrapper + arr[index] + wrapper + ",";
            }
            else
            {
                str = str + wrapper + arr[index] + wrapper + ",";
            }
        }
        return str + wrapper+arr[(arr.length)-1]+wrapper
    }
}
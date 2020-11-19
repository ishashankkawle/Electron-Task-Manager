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

    generateCustomArrayString(wrapper , arr , arrIndexToIgnore)
    {
        let str="";

        if(arr.length == 1)
        {
            return wrapper+arr[0]+wrapper
        }

        for (let index = 0; index < (arr.length)-1; index++) 
        {
            let igoreFlag = false;
            if( arrIndexToIgnore != undefined)
            {
                for (let index2 = 0; index2 < arrIndexToIgnore.length; index2++) 
                {
                    if(index == arrIndexToIgnore[index2])
                    {
                        igoreFlag = true;
                    }    
                    
                }
            }
            if(!igoreFlag)
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
            else
            {
                console.log("STR = " + arr[index]);
                str = str + arr[index] + ",";
            }
        }
        return str + wrapper+arr[(arr.length)-1]+wrapper
    }

    getCurrentDateString()
    {
        let currentDateObj = new Date();
        let dateStr = currentDateObj.getMonth()+"-"+currentDateObj.getDate()+"-"+currentDateObj.getFullYear();
        return dateStr;
    }

    convertArrayForDataTable(arrayOfObjects)
    {
        let data = [];
        for (let index = 0; index < arrayOfObjects.length; index++) 
        {
            const element = arrayOfObjects[index];
            let objectArray = [];
            for (let key in element) 
            {
                if (element.hasOwnProperty(key)) 
                {
                    objectArray.push(element[key]);
                }
            }
            data.push(objectArray);
        }
        return data;
    }
}

module.exports = class Util {
    checkFileExist(FILE_PATH, FILE_NAME) {
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

    generateJSONObject(arrKey, arrValue) {
        if (arrKey.length !== arrValue.length) {
            return;
        }
        let objJSON = {};
        for (let index = 0; index < arrKey.length; index++) {
            objJSON[arrKey[index]] = arrValue[index];
        }
        return objJSON;
    }

    generateCustomArrayString(wrapper, arr, arrIndexToIgnore) {
        let str = "";

        if (arr.length == 1) {
            return wrapper + arr[0] + wrapper
        }

        for (let index = 0; index < (arr.length) - 1; index++) {
            let igoreFlag = false;
            if (arrIndexToIgnore != undefined) {
                for (let index2 = 0; index2 < arrIndexToIgnore.length; index2++) {
                    if (index == arrIndexToIgnore[index2]) {
                        igoreFlag = true;
                    }

                }
            }
            if (!igoreFlag) {
                if (index == 0) {
                    str = wrapper + arr[index] + wrapper + ",";
                }
                else {
                    str = str + wrapper + arr[index] + wrapper + ",";
                }
            }
            else {
                str = str + arr[index] + ",";
            }
        }
        return str + wrapper + arr[(arr.length) - 1] + wrapper
    }

    getCurrentDateString() {
        let currentDateObj = new Date();
        let dateStr = (currentDateObj.getMonth() + 1) + "-" + currentDateObj.getDate() + "-" + currentDateObj.getFullYear();
        return dateStr;
    }

    convertArrayForDataTable(arrayOfObjects) {
        let data = [];
        for (let index = 0; index < arrayOfObjects.length; index++) {
            const element = arrayOfObjects[index];
            let objectArray = [];
            for (let key in element) {
                if (element.hasOwnProperty(key)) {
                    objectArray.push(element[key]);
                }
            }
            data.push(objectArray);
        }
        return data;
    }

    createSelectMenuDataObject(data, keyColumn, dataColumn) {
        let dataArray = [];
        for (let index = 0; index < data.length; index++) {
            let obj = {};
            const element = data[index];
            obj["Option_Text"] = element[keyColumn];
            obj["Option_Value"] = element[dataColumn];
            dataArray.push(obj);
        }
        return dataArray;
    }

    addOptionsInSelectMenu(element, data) {
        for (let index = 0; index < data.length; index++) {
            const obj = data[index];
            let newOption = new Option(obj["Option_Text"], obj["Option_Value"]);
            element.add(newOption, undefined);
        }
    }

    removeOptionsFromSelectMenu(element) {
        let length = element.options.length;
        for (let i = length - 1; i >= 0; i--) {
            element.options[i] = null;
        }
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    generateCustomWrapperArray(wrapper, arr, arrIndexToIgnore) 
    {
        let finalArray = [];

        for (let index = 0; index < (arr.length); index++) {
            let igoreFlag = false;
            if (arrIndexToIgnore != undefined) 
            {
                for (let index2 = 0; index2 < arrIndexToIgnore.length; index2++) {
                    if (index == arrIndexToIgnore[index2]) 
                    {
                        igoreFlag = true;
                    }

                }
            }
            if (!igoreFlag) 
            {
                finalArray.push(wrapper + arr[index] + wrapper)
            }
            else 
            {
                finalArray.push(arr[index]);
            }
        }
        return finalArray;
    }

    getSubArray(arrKey , arrData)
    {
        let arrFinal = [];
        for (let indexData = 0; indexData < arrData.length; indexData++) {
            let obj = arrData[indexData];
            let currentObj = {};
            for (let indexKey = 0; indexKey < arrKey.length; indexKey++) {
                currentObj[arrKey[indexKey]] = obj[arrKey[indexKey]];
            }
            arrFinal.push(currentObj);
        }
        return arrFinal
    }

    async readFile(fileData)
    {
        let reader = new FileReader();
        return new Promise((resolve , reject) => {
            reader.onload = () => {
                resolve(reader.result);
            }

            reader.readAsText(fileData)
        })
    }
}

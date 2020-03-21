module.exports = class httpHandler{

    async sendHttpRequestAsync(url , object)
    {
        const response = await fetch(url , object);
        return await response.json();   
    }

    generateGetObject()
    {
        let obj = {};
        obj[method]= 'GET' // *GET, POST, PUT, DELETE, etc.
        this.addCorsAndCacheOption(obj);
        return object;
    }

    generatePostObject()
    {
        let obj = {};
        obj[method]= 'POST' // *GET, POST, PUT, DELETE, etc.
        this.addCorsAndCacheOption(obj);
        return object;
    }

    generatePutObject()
    {
        let obj = {};
        obj[method]= 'PUT'; // *GET, POST, PUT, DELETE, etc.
        this.addCorsAndCacheOption(obj);
        return object;
    }

    generateDeleteObject()
    {
        let obj = {};
        obj[method]= 'DELETE' // *GET, POST, PUT, DELETE, etc.
        this.addCorsAndCacheOption(obj);
        return object;
    }

    addOptions(object , arrOption , arrValue)
    {
        if(arrOption.length !== arrValue.length)
        {
            return object;
        }
        for(let i = 0; i < arrOption.length; i++)
        {
            object[arrOption[i]] = arrValue[i];
        }
        return object;
    }

    addCorsAndCacheOption(obj)
    {
        obj[mode]= 'cors' // no-cors, *cors, same-origin
        obj[cache]= 'no-cache'
        return obj;
    }

}

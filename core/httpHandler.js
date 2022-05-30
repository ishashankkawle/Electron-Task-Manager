const res = require('../shared/resources');

module.exports = class HttpHandler 
{

    getDefaultHeaders()
    {
        return {
            "Content-Type": "application/json"
        }
    }

    async httpGet(url , customHeaders = this.getDefaultHeaders())
    {
        let data = {}
        await fetch(url , {
            method: 'GET',
            headers: customHeaders
        }).then((result) => {data = result});
        return await data.json();
    }


    async httpPost(url , reqBody , customHeaders = this.getDefaultHeaders())
    {
        let data = {}
        await fetch(url , {
            method: 'POST',
            headers: customHeaders,
            body: JSON.stringify(reqBody)
        }).then((result) => {data = result});
        return await data.json();
    }

    async httpPut(url , reqBody , customHeaders = this.getDefaultHeaders())
    {
        let data = {}
        await fetch(url , {
            method: 'PUT',
            headers: customHeaders,
            body: JSON.stringify(reqBody)
        }).then((result) => {data = result});
        return await data.json();
    }
}
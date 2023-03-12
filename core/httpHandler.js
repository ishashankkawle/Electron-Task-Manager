const axios = require('axios');
const res = require('../shared/resources');

module.exports = class HttpHandler {

    getDefaultHeaders() {
        return { "Content-Type": "application/json" }
    }
    getDefaultMultipartHeaders() {
        return { 'Content-Type': undefined }
    }

    async httpGet(url, customHeaders = this.getDefaultHeaders()) {
        let data = {}
        await fetch(url, {
            method: 'GET',
            headers: customHeaders
        }).then((result) => { data = result });
        return await data.json();
    }


    async httpPost(url, reqBody, customHeaders = this.getDefaultHeaders()) {
        let data = {}
        await fetch(url, {
            method: 'POST',
            headers: customHeaders,
            body: JSON.stringify(reqBody)
        }).then((result) => { data = result });
        return await data.json();
    }

    async httpPut(url, reqBody, customHeaders = this.getDefaultHeaders()) {
        let data = {}
        await fetch(url, {
            method: 'PUT',
            headers: customHeaders,
            body: JSON.stringify(reqBody)
        }).then((result) => { data = result });
        return await data.json();
    }

    async httpPutMultiartData(url, data, customHeaders) {
        data = await axios.put(url, data, { headers: customHeaders }).then(function (response) {
            return response.data;
        });
        return data;
    }

    async httpPostMultiartData(url, data, customHeaders) {
        data = await axios.post(url, data, { headers: customHeaders }).then(function (response) {
            return response.data;
        });
        return data;
    }
}
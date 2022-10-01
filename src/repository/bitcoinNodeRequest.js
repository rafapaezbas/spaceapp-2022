const axios = require('axios').default;

module.exports = {requestKey}

const headers = {
    'x-api-key': '70404817-409a-4359-baeb-e6ba0b16d2f3',
    'Content-Type': 'application/json'
}

function requestKey(method, params) {
    let data = {
        'jsonrpc': '2.0',
        'method': method,
        'params': params,
        'id': 'getblock.io'
    }


    return axios.post('https://btc.getblock.io/testnet/', {
        headers: headers,
        data: data
    })
}
const test = require('brittle')
const sut = require('../src/repository/bitcoinNodeRequest')

test('get tx hex', async({ok}) => {
    const keyPair = await sut.requestKey('getrawtransaction', ['8b63cdc26f59b59107b57d3ab47cd6758227d7480eaf8d7f1bae3ae396651405'])
    ok(keyPair)
})


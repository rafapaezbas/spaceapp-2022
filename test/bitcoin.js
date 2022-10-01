const test = require('brittle')
const { generateAddress } = require('../src/bitcoin')

test('generate new bitcoin address', async ({ ok, teardown }) => {
    const { keyPair, p2pkh } = await generateAddress()
    ok(p2pkh)
    ok(keyPair)
    console.log(p2pkh.address)
    console.log(keyPair.privateKey.toString('hex'))
    console.log(keyPair.publicKey.toString('hex'))
})

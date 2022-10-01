const crypto = require('../src/crypto.js')
const test = require('brittle')

test.solo('generate key pair', async ({ ok }) => {
    const keyPair = crypto.signKeyPair()
    ok(keyPair.pk)
    ok(keyPair.sk)
    console.log(keyPair.sk.toString('hex'))
})

test('sign and verify', async ({ ok }) => {
    const keyPair = crypto.signKeyPair()
    const blob = Buffer.allocUnsafe(1024)
    const signature = crypto.sign(blob, keyPair.sk)
    const verification = crypto.verify(signature, blob, keyPair.pk)
    ok(verification)
})

test('checksum', async ({ ok }) => {
    const filePath = ('/tmp/test.txt')
    const out = await crypto.checksum(filePath)
    ok(out)
})

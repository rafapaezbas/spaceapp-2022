const crypto = require('../src/crypto.js')
const test = require('brittle')

test('generate key pair', async ({ ok }) => {
    const keyPair = crypto.signKeyPair()
    ok(keyPair.pk)
    ok(keyPair.sk)
})

test('sign and verify', async ({ ok }) => {
    const keyPair = crypto.signKeyPair()
    const blob = Buffer.allocUnsafe(1024)
    const signature = crypto.sign(blob, keyPair.sk)
    const verification = crypto.verify(signature, blob, keyPair.pk)
    ok(verification)
})
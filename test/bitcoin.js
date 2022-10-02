const test = require('brittle')
const { generateAddress, txHex } = require('../src/bitcoin')

test.('generate new bitcoin address', async ({ ok, teardown }) => {
    const { keyPair, p2pkh } = await generateAddress()
    ok(p2pkh)
    ok(keyPair)
    console.log(p2pkh.address)
    console.log("SK", keyPair.getPrivate('hex'))
})

test('get hex', async ({ ok, teardown }) => {
    const secretKey = '0b724e630ea1fe3e1d39ff48cd0c38bd4b064278f52283fd530c833f07f8e567'
    const signature = 'signature'
    const txid = ' a0ce71cb9b5d76f0ba66358239e0b93687da7eabf570e94677c1855aae1da83b'
    const utxo = '02000000000101e248c186763d925b86cabc1312c1e0b615c7acfdfeb4c7c55c249577c0cbea660000000000feffffff02e508fe170800000016001461551280a1f9ba54e10c48db5b216d5bc8017b5210270000000000001976a9148dcced885884fc6e3bdabc88fd4cb902feb666c688ac0247304402205484cd918a23f137cae70e6bfd040017f6614113fda6293be1ad8cf2e8bfe3a1022010b939a1a18c5c2ab916548bbcc8c39593432ce0b88ea0c4fcb794271321a24b012103b54440509ea584f2ecd443394544bbb7b1a9828e1f282d445f926cfe636a93b8dbd72300'
    const hex = txHex(secretKey, signature, txid, utxo )
    console.log(hex)
})

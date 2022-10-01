const ecc = require('tiny-secp256k1')
const { ECPairFactory } = require('ecpair')
const bitcoin = require('bitcoinjs-lib')

const testnet = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
}

const ECPair = ECPairFactory(ecc)

const txHex = (secretKey, signature, txid, utxo) => {
    const keyPair = ECPair.fromPrivateKey(Buffer.from(secretKey, 'hex'))
    const payment = bitcoin.payments.p2pkh({ network: testnet, pubkey: keyPair.publicKey })
    const inputData = {
        hash: txid,
        index: 1,  // unspent vout
        nonWitnessUtxo: Buffer.from(utxo, 'hex'),
    }

    const data = Buffer.from(signature, 'utf8');
    const embed = bitcoin.payments.embed({ data: [data] });
    const psbt = new bitcoin.Psbt({ network: testnet })
          .addInput(inputData)
          .addOutput({
              script: embed.output,
              value: 1000,
          })
          .signInput(0, keyPair)
    psbt.finalizeAllInputs()

    return psbt.extractTransaction().toHex()
}

const generateAddress = () => {
    const keyPair = ECPair.makeRandom({ network : testnet })
    const p2pkh = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: testnet })
    return { keyPair, p2pkh }
}

module.exports = { txHex, generateAddress }

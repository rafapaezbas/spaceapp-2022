import * as ecc from 'tiny-secp256k1'
import { ECPairFactory } from 'ecpair'
import * as bitcoin from 'bitcoinjs-lib'

const ECPair = ECPairFactory(ecc)

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

const keyPair = ECPair.fromPrivateKey(Buffer.from('1c2c101fd9d51b93cc9fa155e1dcdcea6656d9c8b4b069dc459e928e4ed7624f', 'hex'))

const payment = bitcoin.payments.p2pkh({ network: testnet, pubkey: keyPair.publicKey })
const inputData = {
	hash: 'f88ea0e750d0b1dbeb50281bb092dd81f9f804b0f070adde3a6bdb049e823378', // unspent txid
	index: 1,  // unspent vout
	nonWitnessUtxo: Buffer.from('0200000000010178179bcf7fd1c1aa71473588d04b55d0c5ca760004f0165ca3f61d47a8763dea0000000000feffffff02b50200000000000016001468a2de14f475d045d0938ea789c7a34a8827a15310270000000000001976a914c5dd1b8555dcd87b0c3513d60d04a037371946bd88ac024730440220757ea90c5100dda62af21b8523494c0dd11d73dc8385b8e49d9884813462e17902206960e1d125f03d19579e0e8582788db3bff9a0ece56f3726f7678ef152dc4326012103df125e7f39a45f8f2e04271236bd44749586a5188527ce57f20b86bdce945543ced22300', 'hex'),
}

const data = Buffer.from('Hello world!', 'utf8');
const embed = bitcoin.payments.embed({ data: [data] });

const psbt = new bitcoin.Psbt({ network: testnet })
	.addInput(inputData)
	.addOutput({
		script: embed.output,
		value: 1000,
	})
	.signInput(0, keyPair)
    psbt.finalizeAllInputs()


const hex = psbt.extractTransaction().toHex()
console.log(hex)

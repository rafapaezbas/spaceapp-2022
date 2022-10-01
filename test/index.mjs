import * as ecc from 'tiny-secp256k1'
import { ECPairFactory } from 'ecpair'
import * as bitcoin from 'bitcoinjs-lib'
import * as liquid from 'liquidjs-lib'

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

const keyPair = ECPair.makeRandom({ network : testnet })
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: testnet })

console.log(keyPair.publicKey.toString('hex'))
console.log(keyPair.privateKey.toString('hex'))
console.log(address)

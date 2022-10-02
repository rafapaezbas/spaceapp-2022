#!/usr/bin/env node

import { seed } from '../src/torrent.js'
import * as bitcoin from '../src/bitcoin.js'
import * as crypto from '../src/crypto.js'
import { readFile } from 'fs/promises'

const filePath = process.argv[2]

if (filePath == '--help' || !filePath) {
    printHelp()
}

const publication = JSON.parse(await readFile(filePath))
const checksum = await crypto.checksum(filePath)
const signature = crypto.sign(checksum, Buffer.from(publication.key, 'hex'))

const secretKey = Buffer.from(publication.p2pkh, 'hex')
const txid = publication.txid
const utxo = publication.utxo

const hex = bitcoin.txHex(secretKey, signature, txid, utxo)
const { torrent } = await seed(publication.file)

console.log(hex)
console.log(' ')
console.log(torrent.magnetURI)

function printHelp () {
  console.log(`
Open Publication v.0.1.0

  Commands:
  open-publication [publication-file-path]

Publication file path format:

{
 file,
 txid,
 key,
 utxo,
 p2pkh
}
`)
}

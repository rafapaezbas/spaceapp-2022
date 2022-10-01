const sodium = require('sodium-native')
const { readFile } = require('fs/promises')

const signKeyPair = () => {
    const pk = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES)
    const sk = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)
    const seed = Buffer.alloc(sodium.crypto_sign_SEEDBYTES)
    sodium.randombytes_buf(seed)
    sodium.crypto_sign_seed_keypair(pk, sk, seed)
    return { seed, pk, sk }
}

const sign = (message, sk) => {
    const signature = Buffer.alloc(sodium.crypto_sign_BYTES)
    sodium.crypto_sign_detached(signature, message, sk)
    return signature
}

const verify = (signature, message, pk) => {
  return sodium.crypto_sign_verify_detached(signature, message, pk)
}

const checksum = async (filePath) => {
    const out = Buffer.alloc(64)
    const file = await readFile(filePath)
    sodium.crypto_generichash(out, file)
    return out
}

module.exports = { signKeyPair, sign, verify, checksum }

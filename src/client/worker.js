const bitcoin = require("./../bitcoin");

onmessage = (e) => {
    const result = bitcoin.txHex(e.data[0], e.data[1], e.data[2], e.data[3])
    postMessage(result)
}

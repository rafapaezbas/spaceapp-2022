const createTorrent = require('create-torrent')
const WebTorrent = require('webtorrent')
const { promisify } = require('util')

const seed = (file) => {
    return new Promise((resolve, reject) => {
        const client = new WebTorrent()
        client.seed(file, (torrent) => {
            resolve({ torrent, client })
        })
    })
}

module.exports = { seed }

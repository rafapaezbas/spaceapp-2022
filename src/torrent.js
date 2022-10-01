const createTorrent = require('create-torrent')
const { promesify } = require('util')

module.exports = createTorrent = (path) => {
    return promesify(createTorrent)(path)
}

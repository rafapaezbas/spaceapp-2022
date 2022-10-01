const torrent = require("../torrent")

module.exports = {uploadFile}

function uploadFile(signedFile) {
    return torrent.seed(signedFile)
}
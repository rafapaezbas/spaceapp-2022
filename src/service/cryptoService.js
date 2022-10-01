const crypto = require("../crypto")

module.exports = {signDocument, verifyDocument}

function signDocument(document, privateKey) {
    return crypto.sign(document, privateKey)
}
function verifyDocument(signature, document, publicKey) {
    return crypto.verify(signature, document, publicKey)
}
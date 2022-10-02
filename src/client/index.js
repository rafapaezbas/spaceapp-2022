const crypto = require("./../crypto");
const torrent = require("./../torrent");
const worker = new Worker('worker.js');

window.onload = () => {
    document.getElementById("select-file-btn").addEventListener("click", onClickSelectFile);
    document.getElementById("submit-document").addEventListener("click", onClickSubmitDocument);
}

let selectedFile = null;

function onClickSelectFile() {
    const {dialog} = require('@electron/remote');
    dialog.showOpenDialog({properties: ['openFile']}).then(event => {
        if (event.canceled != null) {
            selectedFile = event.filePaths[0];
            showSelectedFile();
        }
    });
}

async function onClickSubmitDocument() {

    const torrentURL = (await torrent.seed(selectedFile)).torrent

    const signatureSK = document.getElementById("input-signature-pk").value;
    const bitcoinSK = document.getElementById("input-bitcoin-pk").value;
    const txId = document.getElementById("input-tx-id").value;
    const txHex = document.getElementById("input-tx-hex").value;

    const fileChecksum = await crypto.checksum(selectedFile);
    const signature = crypto.sign(fileChecksum, Buffer.from(signatureSK, "hex"));

    //worker.postMessage([bitcoinSK, signature, txId, txHex])
    worker.onmessage = (msg) => console.log("!!!!", msg)


}

function showSelectedFile() {
    document.getElementById("selected-file").innerText = selectedFile;
    document.getElementById("select-file-btn").style.display = "none";
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.value != null && field.value.trim().length > 0) {
        field.classList.remove("invalid-field");
        return true;
    } else {
        field.classList.add("invalid-field");
        return false;
    }
}



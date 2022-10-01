window.onload = () => {
    document.getElementById("select-file-btn").addEventListener("click", onClickSelectFile);
    document.getElementById("submit-document").addEventListener("click", onClickSubmitDocument);

    document.getElementById("input-signature-pk").value = "2357457c9b9ea731051effd82b9172829df13292fa0c11becf4b6310a8bab32decc8fe63e52446695d750ff096e7ab99f81add6ef303551bc705f5e6a14a686f";
    document.getElementById("input-bitcoin-pk").value = "a3f9ad85d08c98ee539befb4831240a60c1f5fce2552ee85e90725f4d32fd3d6";
    document.getElementById("input-tx-id").value = "8b63cdc26f59b59107b57d3ab47cd6758227d7480eaf8d7f1bae3ae396651405";
    document.getElementById("input-tx-hex").value = "02000000000101e248c186763d925b86cabc1312c1e0b615c7acfdfeb4c7c55c249577c0cbea660000000000feffffff02e508fe170800000016001461551280a1f9ba54e10c48db5b216d5bc8017b5210270000000000001976a9148dcced885884fc6e3bdabc88fd4cb902feb666c688ac0247304402205484cd918a23f137cae70e6bfd040017f6614113fda6293be1ad8cf2e8bfe3a1022010b939a1a18c5c2ab916548bbcc8c39593432ce0b88ea0c4fcb794271321a24b012103b54440509ea584f2ecd443394544bbb7b1a9828e1f282d445f926cfe636a93b8dbd72300";
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

    const signatureSK = document.getElementById("input-signature-pk").value;
    const bitcoinSK = document.getElementById("input-bitcoin-pk").value;
    const txId = document.getElementById("input-tx-id").value;
    const txHex = document.getElementById("input-tx-hex").value;


    const crypto = require("./../crypto");
    const fileChecksum = await crypto.checksum(selectedFile);
    const signature = crypto.sign(fileChecksum, Buffer.from(signatureSK, "hex"));

    const bitcoin = require("./../bitcoin");
    const result = bitcoin.txHex(bitcoinSK, signature, txId, txHex);

    console.log(result);
    alert("zurullo");
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



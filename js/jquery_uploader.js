function uploadchange() {
    var input = document.getElementById("fileupload");
    for (var i = 0; i < input.files.length; i++) {
        thefilesize = input.files[i].fileSize || input.files[i].size;
        if (thefilesize > 1024 * 1024) {
            thefilesize = (Math.round(thefilesize * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        } else {
            thefilesize = (Math.round(thefilesize * 100 / 1024) / 100).toString() + 'KB';
        }
    }
    sendRequest();
}

window.BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;

function sendRequest() {
    var blob = document.getElementById('fileupload').files[0];
    var BYTES_PER_CHUNK = 5242880; // 5MB chunk sizes.
    var SIZE = blob.size;
    var start = 0;
    var end = BYTES_PER_CHUNK;
    window.uploadcounter = 0;
    window.uploadfilearray = [];
    document.getElementById('progressNumber').innerHTML = "Upload: 0 % ";
    while (start < SIZE) {

        var chunk = blob.slice(start, end);
        window.uploadfilearray[window.uploadcounter] = chunk;
        window.uploadcounter = window.uploadcounter + 1;
        start = end;
        end = start + BYTES_PER_CHUNK;
    }
    window.uploadcounter = 0;
    uploadFile(window.uploadfilearray[window.uploadcounter], document.getElementById('fileupload').files[0].name);
}

function fileSelected() {
    var file = document.getElementById('fileupload').files[0];
    if (file) {
        var fileSize = 0;
        if (file.size > 1024 * 1024) fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        else fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

        document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
        document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
        document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
        uploadchange();
    }
}

function uploadFile(blobFile, filename) {
    var fd = new FormData();
    fd.append("fileupload", blobFile);

    var xhr = new XMLHttpRequest();


    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);

    xhr.open("POST", "/php/uploader.php?filename=" + filename, true);
    var uploadPercent = 0;
    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            uploadPercent = parseInt((e.loaded / e.total) * 100);
            $("#progressNumber").text('Upload: ' + uploadPercent + '%');
            $('#progress .bar').css('width', uploadPercent + '%');

        }
    };
    xhr.send(fd);

}

function uploadComplete(evt) {
    /* This event is raised when the server send back a response */
    if (evt.target.responseText != "") {
        alert(evt.target.responseText);
    } else {
        alert('Upload Complete');
    }
}

function uploadFailed(evt) {
    alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
    xhr.abort();
    xhr = null;
    alert("The upload has been canceled or the browser dropped the connection.");
}

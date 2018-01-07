function sendXhr(data) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/report/' + data.type, data.isAsync);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.send(JSON.stringify(data));
}

self.onmessage = function (event) {
    try {
        var data = JSON.parse(event.data);
        sendXhr(data);
    } catch (ex) {
        console.log(ex);
    }
};

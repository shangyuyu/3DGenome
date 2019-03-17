// Load a text resource from a file over the network
var LoadTextResource = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.onload = function () {
        if (request.status < 200 || request.status > 299) {
            callback("ERROR: HTTP Status " + request.status + " on resource " + url);
        } else {
            callback(null, request.responseText);
        }
    };
    request.send();
};

var LoadImage = function (url, callback) {
    var img = new Image();
    image.onload = function () {
        callback(null, image);
    };
    image.src = url;
};

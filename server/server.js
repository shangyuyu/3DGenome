//
// server.js
//
/* jshint -W117 */

"use strict";

let connect = require("connect");
let serveStatic = require("serve-static");

connect().use( serveStatic("../") ).listen(8000, function () {
    console.log("Server running on 8000.");
});

// End of main.js

//
// server.js
//
/* jshint -W117 */

"use strict";

let express = require("express");
let app = express();

connect().use( serveStatic("../") ).listen(8000, function () {
    console.log("Server running on 8000.");
});

// End of main.js

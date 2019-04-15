//
// index.js
//
/* jshint -W117 */

"use strict";

let express = require('express');
let router = express.Router();

let MainController = require("./controllers/MainController");

// Get the main page with webGL canvas
router.get('/', MainController.main);

module.exports = router;

// End of index.js

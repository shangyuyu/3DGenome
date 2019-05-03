//
// index.js
// Router of index (main entrance)
//
/* jshint -W117 */

"use strict";

let express = require('express');
let router = express.Router();

let MainController = require("./controllers/MainController");

// Get the main page with webGL canvas
router.get("/", MainController.main);
router.get("/geneSearch", MainController.geneSearch);

module.exports = router;

// End of index.js

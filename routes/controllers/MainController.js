//
// MainController.js
//
// Router callback functions
/* jshint -W117 */

"use strict";

exports.main = 
function (req, res, next) {

    res.render('main');
};

exports.geneSearch = 
function (req, res, next) {

    res.send(req.query.key);
};

// End of main.js

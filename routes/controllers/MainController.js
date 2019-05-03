//
// MainController.js
//
// [Router callback functions]
/* jshint -W117 */

"use strict";

const Gene = require("../../models/gene");
const GeneSub = require("../../models/geneSub");

exports.main = 
function (req, res, next) {

    res.render('main');
};

exports.geneSearch = 
function (req, res, next) {

    Gene.
        find({"name": req.query.key}).
        limit(10).
        select("name attributes").
        exec(function (err, data) {

            if (err) return console.error(err);

            res.send(data);
        });

};

// End of MainController.js

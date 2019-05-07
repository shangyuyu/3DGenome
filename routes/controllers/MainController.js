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
// Render main page

    res.render('main');
};

exports.geneSearch = 
function (req, res, next) {
// Query gene

    const key = req.query.key;
    const _filter = {

        $or: [
            {name: {$regex: key, $options: "$i"}},
            {attributes: {$regex: key, $options: "$i"}}
        ]
    };

    Gene.
        find(_filter).
        limit(10).
        //select("name attributes").
        exec(function (err, data) {

            if (err) return console.error(err);

            res.send(data);
        });

};

// End of MainController.js

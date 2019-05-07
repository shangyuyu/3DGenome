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

    const key1 = req.query.key1, key2 = req.query.key2, key3 = req.query.key3;
    const cat1 = req.query.cat1, cat2 = req.query.cat2, cat3 = req.query.cat3;
    const logic1 = req.query.logic1, logic2 = req.query.logic3;
    const filter_ = {

        $or: [
            {name: {$regex: key, $options: "$i"}},
            {attributes: {$regex: key, $options: "$i"}}
        ]
    };

    Gene.
        find(filter_).
        limit(10).
        //select("name attributes").
        exec(function (err, data) {

            if (err) return console.error(err);

            res.send(data);
        });

};

// End of MainController.js

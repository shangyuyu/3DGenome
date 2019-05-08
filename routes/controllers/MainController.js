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

    let key1 = req.query.key1, key2 = req.query.key2;
    const cat1 = req.query.cat1, cat2 = req.query.cat2;
    const logic1 = req.query.logic1;

    let filter_;

    if (!key1) key1 = ".";
    if (!key2) key2 = ".";

    if (logic1 === "AND")
    
        filter_ = {
            $and: [
                {[cat1]: {$regex: key1, $options: "gis"}},
                {[cat2]: {$regex: key2, $options: "gis"}},
            ]
    }; else

        filter_ = {
            $or: [
                {[cat1]: {$regex: key1, $options: "gis"}},
                {[cat2]: {$regex: key2, $options: "gis"}}
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

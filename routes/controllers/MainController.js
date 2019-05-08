//
// MainController.js
//
// [Router callback functions]
/* jshint -W117 */

"use strict";

const mongoose = require("mongoose");
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
    const fuzzy = req.query.fuzzy;

    let filter_;

    // FIXME: Use better fuzzy search
    // FIXME: Implement full-text index
    // FIXME: Populate in seach step
    if (!key1) 

        key1 = new RegExp(/./);
    else if (fuzzy === "true")

        key1 = new RegExp(key1.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");

    if (!key2) 

        key2 = new RegExp(/./);
    else if (fuzzy === "true")

        key2 = new RegExp(key2.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");

    if (logic1 === "AND")
    
        filter_ = {
            $and: [
                {[cat1]: key1},
                {[cat2]: key2}
            ]
    }; else

        filter_ = {
            $or: [
                {[cat1]: key1},
                {[cat2]: key2}
            ]
    };

    Gene.
        find(filter_).
        limit(10).
        //select("name attributes").
        exec(function (err, data) {

            if (err) return console.error(err);

            // res.json({key1: key1, key2: key2, fuzzy: fuzzy});  // Debug purpose
            res.send(data);
        });
};


exports.populate = 
function (req, res, next) {

    const idArray = req.query.idArray;
    const objectIdArray = idArray.map(s => mongoose.Types.ObjectId(s));

    GeneSub.
        find({
        '_id': { $in: objectIdArray}
        }, function(err, data){

            if (err) return console.error(err);

            GeneSub.populate(data, {path: "children"}, function (err, data) {

                if (err) return console.error(err);

                res.send(data);
            });
    });
    /*
    // Only work for finding one _id
    GeneSub.
        findById(idArray[0]).
        exec(function (err, data) {

            if (err) return console.error(err);

            console.log("succeed");
            res.send(data);
        });
    */
};

// End of MainController.js

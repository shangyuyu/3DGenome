//
// gene.js
// Defines the Schema of "gene" in database
//
/* jshint -W117 */

"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const geneSchema = new Schema( {

    seq_id: String, 
    source: String, 
    type: String, 
    chr: Number,
    start: Number, 
    end: Number, 
    strand: String, 
    name: String,
    Dbxref: [String],
    attributes: String, 
    children: [ {type: Schema.Types.ObjectId, ref: "geneSubModel"} ]
} );

module.exports = mongoose.model("geneModel", geneSchema);

// End of gene.js

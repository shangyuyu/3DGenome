//
// geneSub.js
// Defines the Schema of "geneSub" in database
//
/* jshint -W117 */

"use strict";

const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const Schema = mongoose.Schema;

const geneSubSchema = new Schema( {

    type: String, 
    chr: Number, 
    start: Number, 
    end: Number, 
    strand: { type: String, enum: ["+", "-"]}, 
    phase: { type: Number, enum: [0, 1, 2] }, 
    attributes: String, 
    children: [ {type: Schema.Types.ObjectId, ref: "geneSubModel"} ], 
    parent: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        refPath: "parentModel" 
    }, 
    parentModel: {
        type: String,
        required: true, 
        enum: ["geneModel", "geneSubModel"]
    }
} );

geneSubSchema.plugin(deepPopulate);

module.exports = mongoose.model("geneSubModel", geneSubSchema);

// End of geneSub.js

//
// This file extracts data from gff3 annotation file and insert it
// into MongoDB using Mongoose
//
/* jshint -W117 */
/* jshint -W069 */

"use strict";

const gff = require('@gmod/gff').default;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filePath = "/Users/ziyizhang/Desktop/Joint Institude/BioStatistics/3D_Genome/data/ref_GRCh38.p12_top_level.gff3";
const url = 'mongodb://localhost:27017/ref_GRCh38_p12_top_level';

let count = 0;
let subCount = 0;
let attri, tempAttri, attriStr, name, Dbxref;
let data;

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

const geneModel = mongoose.model("geneModel", geneSchema);
const geneSubModel = mongoose.model("geneSubModel", geneSubSchema);

let mon = mongoose.connect(url, {useNewUrlParser: true});

let db = mongoose.connection;
db.on("error", console.error.bind(console, ">> Connection error:"));
db.once("open", function () {
    // Connected to the database

    console.log(">> Connected successfully to database");


    // Start parse
    gff.parseFile(filePath, { parseSequences: false })
    .on('data', data => {

        // Only store "gene" or "pseudogene" along with their children
        if ((data[0]["type"] == "gene" || data[0]["type"] == "pseudogene") && 
            retrieveCHR(data[0]["seq_id"])) {

            // Convert attribute to String
            attri = data[0]["attributes"];
            tempAttri = {};
            name = attri["Name"][0];
            Dbxref = attri["Dbxref"];
            for (let key of Object.keys(attri)) {
        
                if (key == "Name" || key == "Dbxref") 
                    continue;
                else if (attri[key].length == 1)
                    tempAttri[key] = attri[key][0];
                else 
                    tempAttri[key] = attri[key];
            }
            attriStr = JSON.stringify(tempAttri);

            // Instantiate gene
            let gene = new geneModel( {

                seq_id: data[0]["seq_id"],
                source: data[0]["source"],
                type: data[0]["type"],
                chr: retrieveCHR(data[0]["seq_id"]),
                start: data[0]["start"],
                end: data[0]["end"],
                strand: data[0]["strand"],
                name: name,
                Dbxref: Dbxref,
                attributes: attriStr
            } );

            // Store gene's children
            for (let i=0; i<data[0]["child_features"].length; i++) {

                let subGene = createGeneSubModel(data[0]["child_features"][i], "geneModel", gene._id);
                gene.children.push(subGene);
            }

            gene.save(saveCB);

            count++;
        }


        function createGeneSubModel(data, parentModel, parentID) {

            // Convert attribute to String
            attri = data[0]["attributes"];
            tempAttri = {};
            for (let key of Object.keys(attri)) {
        
                if (attri[key].length == 1)
                    tempAttri[key] = attri[key][0];
                else 
                    tempAttri[key] = attri[key];
            }
            attriStr = JSON.stringify(tempAttri);
        
            let subGene = new geneSubModel( {
        
                type: data[0]["type"],
                chr: retrieveCHR(data[0]["seq_id"]),
                start: data[0]["start"],
                end: data[0]["end"],
                strand: data[0]["strand"],
                phase: data[0]["phase"],
                attributes: attriStr, 
                parent: parentID, 
                parentModel: parentModel
            } );
        
            // Store subGene's children
            for (let i=0; i<data[0]["child_features"].length; i++) {
        
                let subGene_ = createGeneSubModel(data[0]["child_features"][i], "geneSubModel", subGene._id);
                subGene.children.push(subGene_);
            }
        
            subGene.save(saveCB);
        
            subCount++;
            return subGene;
        }

    } )
    .on("end", () => {

        console.log("GeneSubModel subCount: " + String(subCount));
        console.log("GeneModel Count: " + String(count));
        console.log(">> This is the end. Control+C to terminate.");
    } );

});


function retrieveCHR (str) {

    if (str.slice(0, 5) == "NC_00") {

        return parseInt(str.slice(7, 9), 10);
    } else 
    return null;
}


function saveCB (err) {

    if (err) return console.error(err);    
}


process.on('SIGINT', function() {
        
    mongoose.connection.close(function () {
      console.log(' >> Mongoose disconnected on program termination');
      process.exit(0);
    });
});

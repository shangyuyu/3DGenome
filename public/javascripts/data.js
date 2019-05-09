//
// data.js
//
/* jshint -W117 */
/* jshint -W040 */

"use strict";

// Global core elements
let data;


class DataManager {

    constructor () {

        this.objects = [];
        this.rawData = [];  // rawData[i] => {vec3Array, countArray}
        this.resolution = null;
        this.targetPointNum = null;
    }
}

Object.assign(DataManager.prototype, {

    loadData: function (file) {

        let loader = new THREE.FileLoader();
        loader.load(file, onLoad.bind(this));

        // onload
        function onLoad (data_) {

            let data = data_.split(/(\s+)/).filter( e => e.trim().length > 0 );
            data_ = [];

            const chr = Number(data[0].slice(3));
            const resolution = Number(data[1]);
            const startPos = Number(data[2]);
            const dataScale = 50.0;
            // Warning: 200 5kb segments require 201 points
            const targetPointNum = 201;  // 5Kb * 200 -> 1Mb

            data.splice(0, 3);  // delete chr, resolution, startPos

            // this.objects
            let index = 0;  // No. of object currently working on
            let count = 0;  // How many points have read for current object, regardless of whether effective
            let lineCount = 0;
            let vec3Array = [];
            let countArray = [];
            for (let i = 0; i < data.length; i+=4) {

                count += 1;

                if (data[i+1] !== "nan") {

                    vec3Array.push( new THREE.Vector3( Number(data[i+1])*dataScale, Number(data[i+2])*dataScale, Number(data[i+3])*dataScale ) );
                    countArray.push(count);
                }

                if (count === targetPointNum) {

                    if (vec3Array.length > 1) {
                    // New object should be created
                        // Bind to this.objects
                        this.objects[index] = {
                            geometry: new THREE.CatmullRomCurve3(vec3Array),  // NOTE: Look out for consecutive data missing!
                            pointNum: vec3Array.length,
                            CHR: chr,
                            start: lineCount * resolution + startPos - (targetPointNum-1) * resolution,
                            end: lineCount * resolution + startPos
                        };
                        // Bind vec3Array to this.rawData
                        this.rawData[index] = {
                            vec3Array: vec3Array.slice(),
                            countArray: countArray.slice()
                        };
                    }

                    if (vec3Array.length <= 1)
                        console.warn(`Consecutive data missing detected: from ${lineCount * resolution + startPos - (targetPointNum-1) * resolution} to ${lineCount * resolution + startPos} in chromosome ${chr}.`);
                    else
                        index += 1;

                    // Update vec3Array (whether keep the last vector)
                    if (vec3Array.length > 1) {
                        vec3Array = vec3Array.slice(-1);
                        countArray = [1];
                        count = 1;
                    } else {
                        vec3Array = [];
                        countArray = [];
                        count = 0;
                    }
                }

                lineCount += 1;
            }
            // Tail not enough for a complete object
            if (count > 0) {
                if (vec3Array.length > 1)
                    this.objects[index] = {
                        geometry: new THREE.CatmullRomCurve3(vec3Array),
                        pointNum: vec3Array.length,
                        CHR: chr,
                        start: lineCount * resolution + startPos - (targetPointNum-1) * resolution,
                        end: lineCount * resolution + startPos
                    };
                this.rawData[index] = {
                    vec3Array: vec3Array.slice(),
                    countArray: countArray.slice()
                };
                if (vec3Array.length <= 1) 
                    console.warn(`Consecutive data missing detected: from ${lineCount * resolution + startPos - (targetPointNum-1) * resolution} to ${lineCount * resolution + startPos} in chromosome ${chr}.`);
                vec3Array = [];
                countArray = [];
            }

            this.resolution = resolution;
            this.targetPointNum = targetPointNum;
            data = [];

            init();
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // BindTube & BindLine

    bindTube: function (parent) {
        // Re-create Geometry and Material, bind them to mesh and add to Object3D

        // NOTE: Index may change. Do not save object index.
        // Save mousePick.focusArray info
        let focusArrayUniqueID = [];
        mousePick.getFocusArrayUniqueID( focusArrayUniqueID );
        // Save mousePick.desertArray info
        let desertArrayUniqueID = [];
        mousePick.getDesertArrayUniqueID( desertArrayUniqueID );

        // Deep destruction and clear
        if (parent.children.length > 0) {
            // WARNING: avoid memory leak
            disposeHierarchy(parent, disposeNode);
        }
        mousePick.clearFocused();
        mousePick.clearDeserted();
        // text.removeAllFocusLeftInfoPanel();
        // text.removeAllDesertLeftInfoPanel();

        // Re-construct
        // TIME-CONSUMING!  FIXME
        let geometry, material, mesh;
        for (let i=0; i<this.objects.length; i+=1) {

            // Empty object not allowed
            // if (data.objects[i].objectSize === 0) continue;

            geometry = new THREE.TubeBufferGeometry(
                this.objects[i].geometry, 
                this.objects[i].pointNum * gui.renderConfig.tubularSegment, 
                gui.renderConfig.radius, 
                gui.renderConfig.radialSegment, 
                false  // 'closed' should be kept false
            );  

            material = new THREE.MeshPhongMaterial( {
                color: Number( gui.renderConfig.materialColor.replace("#", "0x") ), 
                emissive: Number( gui.renderConfig.materialEmissive.replace("#", "0x") ), 
                specular: Number( gui.renderConfig.materialSpecular.replace("#", "0x") ),
                // side: THREE.DoubleSide, 
                flatShading: false  // 'false' for better visual effect
            } );

            // bind Geometry and Material
            mesh = new THREE.Mesh(geometry, material);
            mesh.name = "Segment" + String(i);
            mesh.uniqueID = {
                CHR: this.objects[i].CHR,
                start: this.objects[i].start,
                end: this.objects[i].end
            };
            // bind auxi properties
            mesh.protected = false;
            mesh.recoverHex = "";
            mesh.protectedRecoverHex = "";
            mesh.deserted = false;

            parent.add(mesh);
        }

        // FIXME: require exactly the same uniqueID to set
        // recover focusArray
        mousePick.setAsFocusFromArray(parent, focusArrayUniqueID);  // will also resume leftInfoPanel
        // recover desertArray
        mousePick.setAsDesertFromArray(parent, desertArrayUniqueID);  // will also resume leftInfoPanel
    },

    bindLine: function (parent) {
        // Re-create Geometry and Material, bind them to line and add to Object3D

        if (parent.children.length > 0) {
            // WARNING: avoid memory leak
            disposeHierarchy(parent, disposeNode);
        }

        let lineGeometry, temp = [], tempCoordData, line;
        for (let i=0; i<data.objects.length; i+=1) {

            // Empty object not allowed
            // if (data.objects[i].objectSize === 0) continue;

            lineGeometry = new THREE.BufferGeometry();

            // Retrieve position data from curve
            temp = data.objects[i].geometry.getSpacedPoints(data.objects[i].pointNum * 
                (advancedConfig.auxiScenePoints ? advancedConfig.auxiScenePoints : gui.renderConfig.tubularSegment)
            );
            tempCoordData = new Float32Array(temp.length*3);
            for (let j=0; j<temp.length; j+=1) {

                tempCoordData[j*3  ] = temp[j].x;
                tempCoordData[j*3+1] = temp[j].y;
                tempCoordData[j*3+2] = temp[j].z;
            }

            lineGeometry.addAttribute( 
                "position", 
                new THREE.Float32BufferAttribute(tempCoordData, 3) 
            );

            line = new THREE.Line(lineGeometry);
            line.name = "Lineseg" + String(i);
            line.uniqueID = {
                CHR: this.objects[i].CHR,
                start: this.objects[i].start,
                end: this.objects[i].end
            };

            parent.add(line);
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // Merge

    merge: function (object) {
    // Merge new "object" into this.objects
    // object: {
    //     uniqueID: {...},
    //     name: String,
    //     info: {...}
    // }

        const startIndex = this.getParentObjectIndex(object.uniqueID.start, object.uniqueID.CHR);
        const endIndex = this.getParentObjectIndex(object.uniqueID.end, object.uniqueID.CHR);

        if (startIndex === -1 || endIndex === -1)
            return console.warn("Merge failure: new object locates in area(s) where raw 3D data is missing or not loaded.");

        // FIXME
        if (startIndex !== endIndex)
            return console.warn("Merge failure: new object locates in more than one current split objects.");

        const parentObject = this.objects[startIndex];
        const parentRawData = this.rawData[startIndex];
        const startPercentage = (object.uniqueID.start - parentObject.start) / (parentObject.end - parentObject.start);
        const endPercentage = (object.uniqueID.end - parentObject.start) / (parentObject.end - parentObject.start);
        const parentCountArrayPercentage = parentRawData.countArray.map(x => x / this.targetPointNum);

        if (parentCountArrayPercentage[0] > startPercentage || parentCountArrayPercentage[parentCountArrayPercentage.length-1] < endPercentage)
            return console.warn("Merge failure: new object locates in an area where part of required 3D data is missing.");

        // Find indexs of where new object should be merged
        for (let i=0; i<parentCountArrayPercentage.length; i+=1) {

            
        }
    },

    //////////////////////////////////////////////////////////////////////////////
    // Auxiliary

    getParentObjectIndex: function (locus, chr) {
    // Find which object in "this.objects" contains "locus"
    // return its index if found, -1 otherwise

        const objects = this.objects;

        for (let i=0; i<objects.length; i+=1) {

            if (objects[i].CHR === chr && objects[i].start <= locus && objects[i].end >= locus)
                return i;
        }

        return -1;
    }

} );


// FIXME
$(window).on('load', function() {
    data = new DataManager();  // FIXME How to trigger?
    data.loadData("../data/chr1_5kb_miniMDS_structure.tsv");
});

// End of data.js

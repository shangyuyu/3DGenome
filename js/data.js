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
        this.rawData = [];
        this.infoData = null;
        this.objectSize  = 200;  // 200 points as an object - 1Mb for 5kb resolution
    }
}

Object.assign(DataManager.prototype, {

    loadData: function (file) {

        let loader = new THREE.FileLoader();
        loader.load(file, onLoad.bind(this));

        // onload
        function onLoad (data_) {

            let data = data_.split(/(\s+)/).filter( e => e.trim().length > 0 );
    
            const chr = Number(data[0].slice(3));
            const resolution = Number(data[1]);
            const startPos = Number(data[2]);
            const dataScale = 50.0;
    
            data.splice(0, 3);  // delete chr, resolution, startPos
    
            // this.objects
            let index = 0;
            let count = 0;
            let tempVec3Array = [];
            for (let i = 0; i < data.length; i+=4) {
                
                count += 1;
                
                if (data[i+1] !== "nan")
                    tempVec3Array.push( new THREE.Vector3( Number(data[i+1])*dataScale, Number(data[i+2])*dataScale, Number(data[i+3])*dataScale ) );

                if (count === this.objectSize) {
    
                    count = 0;

                    if (tempVec3Array.length > 1)
                        this.objects[index] = {
                            geometry: new THREE.CatmullRomCurve3(tempVec3Array),  // NOTE: Consecutive data missing!
                            objectSize: tempVec3Array.length,
                        };
                    // locus? FIXME
                    if (tempVec3Array.length <= 1)
                        console.warn(`Consecutive data missing detected: Object #${index} from ${index*this.objectSize*resolution+startPos} to ${(index+1)*this.objectSize*resolution+startPos} in chromosome ${chr}.`);
                    else
                        index += 1;
                    tempVec3Array = [];
                }
            }
            if (count > 0) {
                if (tempVec3Array.length > 1)
                    this.objects[index] = {
                        geometry: new THREE.CatmullRomCurve3(tempVec3Array),
                        objectSize: tempVec3Array.length,
                    };
                // locus? FIXME
                if (tempVec3Array.length <= 1) 
                    console.warn(`Consecutive data missing detected: Object #${index} from ${index*this.objectSize*resolution+startPos} to ${(index+1)*this.objectSize*resolution+startPos} in chromosome ${chr}.`);
                tempVec3Array = [];
            }
    
            // this.rawData
            this.rawData[chr] = data;
            data = [];
    
            init();
        }
    },

    bindTube: function (parent) {
        // Re-create Geometry and Material, bind them to mesh and add to Object3D

        // Save mousePick.focusArray info
        let indexFocusArray = [];
        mousePick.getFocusIndexArray( indexFocusArray );
        // Save mousePick.desertArray info
        let indexDesertArray = [];
        mousePick.getDesertIndexArray( indexDesertArray );

        // Deep destruction
        if (parent.children.length > 0) {
            // memory leak?
            disposeHierarchy(parent, disposeNode);
        }
        mousePick.clearFocused();
        mousePick.clearDeserted();
        text.removeAllFocusLeftInfoPanel();
        text.removeAllDesertLeftInfoPanel();

        // Re-construct
        // TIME-CONSUMING!  FIXME
        let geometry, material, mesh;
        for (let i=0; i<data.objects.length; i+=1) {

            // Empty object not allowed
            // if (data.objects[i].objectSize === 0) continue;

            geometry = new THREE.TubeBufferGeometry(
                data.objects[i].geometry, 
                data.objects[i].objectSize * gui.renderConfig.tubularSegment, 
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
            mesh.name = "Segment" + String(i);  // Name used for shadow mouse pick
            // bind auxi properties
            mesh.protected = false;
            mesh.recoverHex = "";
            mesh.protectedRecoverHex = "";
            mesh.deserted = false;

            parent.add(mesh);
        }

        // recover focusArray
        mousePick.setAsFocus(parent, indexFocusArray);  // will also resume leftInfoPanel
        // recover desertArray
        mousePick.setAsDesert(parent, indexDesertArray);
    },

    bindLine: function (parent) {
        // Re-create Geometry and Material, bind them to line and add to Object3D

        if (parent.children.length > 0) {
            // memory leak?
            disposeHierarchy(parent, disposeNode);
        }

        let lineGeometry, temp = [], tempCoordData, line;
        for (let i=0; i<data.objects.length; i+=1) {

            // Empty object not allowed
            // if (data.objects[i].objectSize === 0) continue;

            lineGeometry = new THREE.BufferGeometry();

            // Retrieve position data from curve
            temp = data.objects[i].geometry.getSpacedPoints(data.objects[i].objectSize * 
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
            line.name = "Lineseg" + String(i);  // Name used for shadow mouse pick
            parent.add(line);
        }
    },

} );


data = new DataManager();  // FIXME How to trigger?
data.loadData("../data/chr1_5kb_miniMDS_structure.tsv");

// End of data.js

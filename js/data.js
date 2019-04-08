//
// data.js
//
/* jshint -W117 */

"use strict";

class DataManager {

    constructor () {

        this.objects = [];
        this.rawData = null;
        this.infoData = null;
    }
}

Object.assign(DataManager.prototype, {

    loadData: function (file) {

        let loader = new THREE.FileLoader();
        loader.load(file, onLoad);
    },

    onLoad: function (data_) {

        let data = data_.split(/(\s+)/).filter( e => e.trim().length > 0 );
        
        const chr = Number(data[0]);
        const resolution = Number(data[1]);
        const startPos = Number(data[2]);
        const dataScale = 50.0;
        const objectSize  = 200;  // 200 points as an object

        data.splice(0, 3);  // delete chr, resolution, startPos

        // this.objects
        let index = 0;
        let count = 0;
        let tempVec3Array = [];
        for (let i = 0; i < data.length; i+=4) {
            
            count += 1;
            if (data[i+1] === "nan") continue;

            tempVec3Array.push( new THREE.Vector3( Number(data[i+1])*dataScale, Number(data[i+2])*dataScale, Number(data[i+3])*dataScale ) );

            if (count == objectSize) {

                count = 0;
                this.objects[index].geometry.push( new THREE.CatmullRomVurve3(tempVec3Array) );
                // locus? FIXME
                tempVec3Array = [];
                index += 1;
            }
        }
        if (count > 0) {
            this.objects[index].geometry.push( new THREE.CatmullRomVurve3(tempVec3Array) );
            tempVec3Array = [];
        }

        // this.rawData
        this.rawData[chr] = data;
        data = [];

        init();
    }
} );

// End of data.js

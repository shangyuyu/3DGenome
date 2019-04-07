//
// text.js
//
/* jshint -W117 */

"use strict";

class TEXT {

    constructor () {

        this.topInfoPanelEnable = true;
        this.topInfoPanel = this.newTopInfoPanel();
        this.array = [];
    }
}

Object.assign(TEXT.prototype, {

    pixelRatio: function (ctx) {

        let dpr = window.devicePixelRatio || 1;
        let bsr = ctx.webkitBackingStorePixelRatio ||
                  ctx.mozBackingStorePixelRatio ||
                  ctx.msBackingStorePixelRatio ||
                  ctx.oBackingStorePixelRatio ||
                  ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    },

    newTopInfoPanel: function () {

        let canvas = document.getElementById("topInfoPanel");
        let context = canvas.getContext("2d");

        // Fix pixel ratio blurry bug
        let ratio = this.pixelRatio(context);
        canvas.width *= ratio;
        canvas.height *= ratio;

        context.font = "24px Verdana";
        context.fillStyle = "rgba(255, 255, 255, 1.0)";

        return {canvas: canvas, context: context, ratio: ratio};
    },

    newInfoPanel: function () {


    },

    newTextSprite: function (message, opts) {
    // return a sprite object

        let parameters = opts || {};
        let fontface = parameters.fontface || 'Helvetica';
        let fontsize = parameters.fontsize || 10;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        let metrics = context.measureText(message).width;
        let textWidth = metrics.width;
        //canvas.width = 800;
        //canvas.height = 317;

        // text color
        context.fillStyle = "rgba(255, 0, 0, 0.7)";
        context.fillText(message, 0, fontsize);

        // canvas contents will be used for a texture
        let texture = new THREE.Texture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        let spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        let sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set( 20, 10, 1.0 );            
        //sprite.position.set(0, 0, 100);
        // copy or = ?
        scene.add(sprite);      

        return sprite;
    },

    setText: function (object, message) {
    // object: {canvas:..., context:..., ratio:...}

        // Clear canvas
        object.context.clearRect(0, 0, object.canvas.width, object.canvas.height);
        // Border rect
        object.context.rect(0, 0, object.canvas.width, object.canvas.height);
        object.context.strokeStyle = "#333333";
        object.context.lineWidth = 5;
        object.context.stroke();
        // Fill text
        object.context.fillText(message, 78*object.ratio, 24*object.ratio);  // FIXME
    },

    showTopInfoPanel: function () {

        $("#topInfoContainer").css("display", "block");
    },

    hideTopInfoPanel: function () {

        $("#topInfoContainer").css("display", "none");
    },
} );

// End of text.js

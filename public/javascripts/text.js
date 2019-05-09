//
// text.js
//
/* jshint -W117 */

"use strict";

class TEXT {

    constructor () {

        this.topInfoPanelEnable = true;
        this.leftInfoPanelEnable = true;
        this.searchPanelEnable = false;
        this.topInfoPanel = this.newTopInfoPanel();
        this.leftInfoPanel = this.newLeftInfoPanel();
        this.searchPanel = this.newSearchPanel();
        this.array = [];  // for sprite, temporarily useless
    }
}

Object.assign(TEXT.prototype, {

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

    newLeftInfoPanel: function () {

        let content = document.getElementById("leftInfoPanel_ejs");
        // let focusDiv, desertDiv, templateDiv;

        // Initialize JS Panel
        jsPanel.create( {
            id: "leftInfoPanel",
            position: "left-top",
            panelSize: "300 " + String(window.innerHeight),
            theme: "#1a1a1a filled",
            border: "2px #333333",
            header: false,
            content: content,
            contentOverflow: "scroll",
            dragit: false,
        } );

        // leftInfoPanel opacity
        $("#leftInfoPanel").css("opacity", 0.8);

        return null;
        // Default tab
        // document.getElementById("FocusButton").click();
        // Fetch text divs
        // focusDiv = document.getElementById("Focus");
        // desertDiv = document.getElementById("Desert");
        // templateDiv = document.getElementById("template");
        // Remove template from DOM
        // templateDiv.parentNode.removeChild(templateDiv);
        // .hover trigger js
            // this function has been moved to "addToLeftInfoPanel"
            // because nodes are dynamically created

        // return {focus: focusDiv, desert: desertDiv, template: templateDiv};
    },

    newSearchPanel: function () {

        let content = document.getElementById("searchPanel_ejs");
        let searchBarDiv, searchListDiv, self;

        // Initialize JS Panel
        self = jsPanel.create( {
            id: "searchPanel",
            position: {
                my: "left-top",
                at: "right-top", 
                of: "#leftInfoPanel",
            },
            panelSize: String(window.innerWidth - 300) + " " + String(window.innerHeight),
            // FIXME: leftInfoPanel and searchPanel size depend on each other
            theme: "#1a1a1a filled",
            border: "2px #333333",
            header: false,
            content: content,
            contentOverflow: "scroll", 
            dragit: false,
        } );

        // searchPanel opacity
        $("#searchPanel").css( {
            "opacity": 0.9,
            "display": "none"
        } );
        // Fetch divs
        searchBarDiv = document.getElementById("searchBar");
        searchListDiv = document.getElementById("searchList");

        return {self: self, searchBar: searchBarDiv, searchList: searchListDiv};
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

    //////////////////////////////////////////////////////////////
    // topInfoPanel

    setText: function (object, message) {
    // object: {canvas:..., context:..., ratio:...}

        // Clear canvas
        object.context.clearRect(0, 0, object.canvas.width, object.canvas.height);
        // Border rect
        object.context.rect(0, 0, object.canvas.width, object.canvas.height);
        object.context.strokeStyle = "#333333";
        object.context.lineWidth = 6;
        object.context.stroke();
        // Fill text
        object.context.textAlign = "center";
        object.context.fillText(message, object.canvas.width/2.0, object.canvas.height/2.0 + 10);  // "10" is decided by font-size
    },

    //////////////////////////////////////////////////////////////
    // leftInfoPanel

    /* Deprecated. Check angular.left-list.component
    addToLeftInfoPanel: function (object, tab) {
    // tab: {"focus", "desert"}

       let node = this.leftInfoPanel.template.cloneNode(true);
       let id = (tab === "focus" ? "F" : "D") + object.name;

       node.children[0].innerText = object.name;
       node.children[1].textContent = "Effective points " + String(data.objects[ nameParse(object.name) ].pointNum) + "/" + String(data.objects[ nameParse(object.name) ].objectSize);
       node.children[2].textContent = uniqueID2string(object.uniqueID);
       node.setAttribute("id", id);

       this.leftInfoPanel[tab].appendChild( node );

       // new node of class "objectInfo" created
       // jQuery hover event re-bind
       $("#"+id).hover( function () {
        // mouseover
            mousePick.onLeft();  // In case currently intersected with an object
            mousePick.enable = false;
            mousePick.INTERSECTED = object;
            mousePick.onPick();
        }, function () {
        // mouseleave
            // NOTE: If button is clicked, this function will need to be manually triggered
            mousePick.enable = true;
            mousePick.onLeft();  // will clear mousePick.INTERSECTED
            mousePick.enable = gui.mousePickConfig.enable;
        } );
    },
    */

    /* Deprecated. Check angular.left-list.component
    removeFromLeftInfoPanel: function (name) {
    // return true if successfully removed

        let node = document.getElementById(name);
        if (node.parentNode) {
            node.parentNode.removeChild(node);
            return true;
        }

        return false;
    },
    */

    /* Deprecated. Check angular.left-list.component
    removeAllFocusLeftInfoPanel: function () {
    // Remove all data but keep prototype

        while (this.leftInfoPanel.focus.lastChild)
            this.leftInfoPanel.focus.removeChild(this.leftInfoPanel.focus.lastChild);
    },
    */

    /* Deprecated. Check angular.left-list.component
    removeAllDesertLeftInfoPanel: function () {
    // Remove all data but keep prototype

        while (this.leftInfoPanel.desert.lastChild)
            this.leftInfoPanel.desert.removeChild(this.leftInfoPanel.desert.lastChild);
    },
    */

    //////////////////////////////////////////////////////////////
    // Visibility

    showTopInfoPanel: function () {

        $("#topInfoContainer").css("display", "block");
    },

    hideTopInfoPanel: function () {

        $("#topInfoContainer").css("display", "none");
    },

    showLeftInfoPanel: function () {

        $("#leftInfoPanel").css("display", "block");
    },

    hideLeftInfoPanel: function () {

        $("#leftInfoPanel").css("display", "none");
    },

    showSearchPanel: function () {

        $("#searchPanel").css("display", "block");
    },

    hideSearchPanel: function () {

        $("#searchPanel").css("display", "none");
    },

    //////////////////////////////////////////////////////////////
    // auxiliary

    pixelRatio: function (ctx) {

        let dpr = window.devicePixelRatio || 1;
        let bsr = ctx.webkitBackingStorePixelRatio ||
                  ctx.mozBackingStorePixelRatio ||
                  ctx.msBackingStorePixelRatio ||
                  ctx.oBackingStorePixelRatio ||
                  ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    },
} );

// End of text.js

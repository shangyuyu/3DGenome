//
//  left-list.component.js
//
/* jshint -W117 */

"use strict";

// Register "left-list" component, along with its associated controller and template
function LeftListController($scope) {

    let self = this;

    // Default open tab
    self.open = "Focus";

    $scope.openTab = function (name, event) {
    // name === "Focus" / "Desert"

        self.open = name;

        let tablinks = document.getElementsByClassName("tablinks");
        for (let i=0; i<tablinks.length; i++) {

            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        event.currentTarget.className += " active";
    };

    $scope.getFocusArray = function () {

        return mousePick ? mousePick.focusArray : [];
    };

    $scope.getDesertArray = function () {

        return mousePick ? mousePick.desertArray : [];
    };

    $scope.mouseover = function (object) {

        mousePick.onLeft();
        mousePick.enable = false;
        mousePick.INTERSECTED = object;
        mousePick.onPick();
    };

    $scope.mouseleave = function () {

        mousePick.enable = true;
        mousePick.onLeft();
        mousePick.enable = gui.mousePickConfig.enable;
        // SearchPanel can override mousePick.enable
        if (text.searchPanelEnable) mousePick.enable = false;
    };

    $scope.removeFocus = function (object) {

        // mouseleave
        // Assume "mouseover" has been triggered
        $scope.mouseleave();
        // MousePick
        const removeSuccess = mousePick.removeFromFocusArray(object.uniqueID);

        if (!removeSuccess)
            console.warn(`Critical error: leftList controller failed to remove ${JSON.stringify(object.uniqueID)} from focusArray.`);
    };

    $scope.removeDesert = function (object) {

        // mouseleave
        // Assume "mouseover" has been triggered
        $scope.mouseleave();
        // MousePick
        const removeSuccess = mousePick.removeFromDesertArray(object.uniqueID);

        if (!removeSuccess)
            console.warn(`Critical error: leftList controller failed to remove ${JSON.stringify(object.uniqueID)} from desertArray.`);
    };

    $scope.getStringUID = function (object) {

        return JSON.stringify(object.uniqueID);
    };

    $scope.refresh = function () {
    // Auxiliary function, cannot be empty for unknown reason
    // FIXME Against angular.js design

        return null;
    };
}


angular.
    module("angularApp").
    component("leftList", {

        templateUrl: "javascripts/angular/left-list.html",
        controller: LeftListController
    });

//  End of left-list.component.js

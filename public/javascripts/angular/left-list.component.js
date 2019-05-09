//
//  left-list.component.js
//
/* jshint -W117 */

"use strict";

// Register "left-list" component, along with its associated controller and template
function LeftListController($scope) {

    let self = this;

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

    $scope.refresh = function () {
    // Auxiliary function, cannot be empty for unknown reason

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

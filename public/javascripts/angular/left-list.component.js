//
//  left-list.component.js
//
/* jshint -W117 */

"use strict";

// Register "left-list" component, along with its associated controller and template
function LeftListController($scope, $window) {

    let self = this;

    self.open = "Focus";

    $scope.openTab = function (name, event) {
    // name === "Focus" / "Desert"

        self.open = name;
        self.focusArray = mousePick.focusArray;
        self.desertArray = mousePick.desertArray;
        
        let tablinks = document.getElementsByClassName("tablinks");
        for (let i=0; i<tablinks.length; i++) {

            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        event.currentTarget.className += " active";
    };
}


angular.
    module("angularApp").
    component("leftList", {

        templateUrl: "javascripts/angular/left-list.html",
        controller: LeftListController
    });

//  End of left-list.component.js

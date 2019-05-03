//
//  gene-list.component.js
//
/* jshint -W117 */

"use strict";

// Register "gene-list" component, along with its associated controller and template
function GeneListController($scope, $http) {

    let self = this;

    $scope.submit = function () {

        console.log("Confirm click submit.");

        let params = {
            "key": $scope.queryKey
        };

        $http.get("/geneSearch", {params:params}).then(
            // On success
            function (res) {

                self.genes = res.data;
                console.log(res.data);
            }, 
            // On failure
            function (res) {

                console.log("get failure: " + String(params));
            }
        );
    };
}


angular.
    module("angularApp").
    component("geneList", {

        templateUrl: "javascripts/angular/gene-list.html",
        controller: GeneListController
    });
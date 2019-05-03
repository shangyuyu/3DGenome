//
//  gene-list.component.js
//
/* jshint -W117 */

"use strict";

// Register "gene-list" component, along with its associated controller and template
function GeneListController($scope, $http) {

    let self = this;

    $scope.submit = function () {


        let params = {
            "key": $scope.queryKey
        };

        $http.get("/geneSearch", {params:params}).then(
            // On success
            function (res) {

                self.genes = res.data;
                // Required if stringified "attributes" is used
                for (let gene of self.genes) {

                    gene.attributes = JSON.parse(gene.attributes);
                }
            }, 
            // On failure
            function (res) {

                console.log("http:Get failure: " + res);
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

//
//  gene-list.component.js
//
/* jshint -W117 */

"use strict";

// Register "gene-list" component, along with its associated controller and template
function GeneListController($scope, $http) {

    let self = this;

    $scope.logics = ["AND", "OR"];
    $scope.cats = ["name", "Dbxref"];

    $scope.submit = function () {

        let params = {
            "key1": $scope.queryKey1, 
            "key2": $scope.queryKey2, 
            "cat1": $scope.cat1, 
            "cat2": $scope.cat2, 
            "logic1": $scope.logic1
        };

        $http.get("/geneSearch", {params:params}).then(
            // On success
            function (res) {

                self.genes = res.data;

                // Clean data for output
                for (let gene of self.genes) {

                    gene.attributes = JSON.parse(gene.attributes);
                    // Required if stringified "attributes" is used
                    delete gene.__v;
                    delete gene._id;
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

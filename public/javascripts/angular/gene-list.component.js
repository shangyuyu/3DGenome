//
//  gene-list.component.js
//
/* jshint -W117 */

"use strict";

// Register "gene-list" component, along with its associated controller and template
function GeneListController($scope, $http) {

    let self = this;

    $scope.logics = ["AND", "OR"];
    $scope.cats = ["name", "attributes", "Dbxref"];
    $scope.fuzzy = true;

    $scope.submit = function () {

        let params = {
            "key1": $scope.queryKey1, 
            "key2": $scope.queryKey2, 
            "cat1": $scope.cat1, 
            "cat2": $scope.cat2, 
            "logic1": $scope.logic1,
            "fuzzy": $scope.fuzzy
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

                console.error("http::get submit failure: " + res);
            }
        );
    };

    $scope.populate = function (gene) {

        $http.get("/populate", {params:gene.children}).then(
            // On success
            function (res) {

                gene.children = res.data;
            }, 
            // On failure
            function (res) {

                console.error("http::get populate failure: " + res);
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

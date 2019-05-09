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

    function cleanData (object) {

        if (typeof(object) !== "object") return;
        if (object.children) {

            for (let child of object.children)

                cleanData(child);
        }

        object.attributes = JSON.parse(object.attributes);
        // Required if stringified "attributes" is used
        delete object.__v;
        delete object._id;
        if (object.hasOwnProperty("parent"))
            delete object.parent;
        if (object.hasOwnProperty("parentModel"))
            delete object.parentModel;
    }

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
                self.genes.forEach(cleanData);
            }, 
            // On failure
            function (res) {

                console.error("http::get submit failure");
                console.error(res);
            }
        );
    };

    $scope.populate = function (gene) {

        if (gene.children.length == 0) return;

        $http.get("/populate", {params:{"idArray[]": gene.children}}).then(
            // On success
            function (res) {

                gene.children = res.data;
                
                // Clean data for output
                gene.children.forEach(cleanData);
            }, 
            // On failure
            function (res) {

                console.error("http::get populate failure");
                console.error(res);
            }
        );
    };

    $scope.focus = function (gene) {
    // Split data.objects and re-render scene to focus this specific gene
    // FIXME CHR check

        const newObject = {
            uniqueID: {
                CHR: gene.chr, 
                start: gene.start, 
                end: gene.end
            }, 
            name: gene.name,
            info: gene
        };
        data.merge(newObject);
    };

    $scope.isString = function (object) {
    // Auxiliary function for ng-if

        return (typeof object == "string");
    };
}


angular.
    module("angularApp").
    component("geneList", {

        templateUrl: "javascripts/angular/gene-list.html",
        controller: GeneListController
    });

//  End of gene-list.component.js

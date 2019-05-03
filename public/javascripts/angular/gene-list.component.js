//
//  gene-list.component.js
//
/* jshint -W117 */

"use strict";

// Register "gene-list" component, along with its associated controller and template
angular.
    module("angularApp").
    component("geneList", {

        templateUrl: "javascripts/angular/gene-list.html",
        controller: function GeneListController() {

            this.genes = [
                {
                    name: "gene1", 
                    attri: "hello"
                },
                {
                    name: "gene2", 
                    attri: "world"
                }
            ];
        }
    });

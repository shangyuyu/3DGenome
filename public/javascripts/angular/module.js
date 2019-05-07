//
//  module.js
//
/* jshint -W117 */

"use strict";

// Define the 'angularApp' module
angular.module("angularApp", ['jsonFormatter']).
config(function (JSONFormatterConfigProvider) {

    // Enable the hover preview feature
    JSONFormatterConfigProvider.hoverPreviewEnabled = true;
    JSONFormatterConfigProvider.hoverPreviewArrayCount = 6;
    JSONFormatterConfigProvider.hoverPreviewFieldCount = 3;
});

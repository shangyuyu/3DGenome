//
//  advanced.js
//
/* jshint -W117 */

"use strict";

// Global advanced configuration
let advancedConfig = {
    auxiScene: false,           // whether to render auxiScene
    auxiScenePoints: 0,         // points in auxiScene, 0 will sync it with the number in main scene
                                // WARNING: value other than 0 will invalidate mouse selection
    mouseSelTimeDisp: true,     // log the time cost for each calculation of mouse selection
    mouseSelInterval: 250,      // Two calls of rayCaster should wait at least 'mouseSelInterval' ms
                                // WARNING: if this value <100, mouse stay time would need to change
};

// End of advanced.js

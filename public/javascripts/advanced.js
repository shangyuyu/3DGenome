//
//  advanced.js
//
/* jshint -W117 */

"use strict";

// Global advanced configuration
let advancedConfig = {
    auxiScene: true,           // whether to render auxiScene
    auxiScenePoints: 0,         // points in auxiScene, 0 will sync it with the number in main scene
                                // WARNING: value other than 0 will invalidate mouse pick
    mousePickTimeDisp: false,   // log the time cost for each calculation of mouse pick
    mousePickInterval: 400,     // Two calls of rayCaster should wait at least 'mouseSelInterval' ms
    mouseStayTime: 150,         // Mouse pick will be called after mouse stay still for 'mouseStayTime' ms
                                // NOTE: Suggested that 'mouseStayTime' + 100 < 'mousePickInterval'
};

// End of advanced.js

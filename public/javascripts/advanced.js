//
//  advanced.js
//
/* jshint -W117 */

"use strict";

// Global advanced configuration
const advancedConfig = {
    auxiScene: false,           // whether to render auxiScene
    auxiScenePoints: 0,         // points in auxiScene, 0 will sync it with the number in main scene
                                // WARNING: value other than 0 will invalidate mouse pick
    mousePickTimeDisp: false,   // log the time cost for each calculation of mouse pick
    mousePickInterval: 400,     // Two calls of rayCaster should wait at least 'mouseSelInterval' ms
    mouseStayTime: 150,         // Mouse pick will be called after mouse stay still for 'mouseStayTime' ms
                                // NOTE: Suggested that 'mouseStayTime' + 100 < 'mousePickInterval'
    autoTransparentDotProduct: 0.9,  // (0, 1) Conical frustum sin[(R1-R2) / h]  REF:http://mathworld.wolfram.com/ConicalFrustum.html
    autoTransparentLength: 20,       // (0, 100) Conical frustum top radius R2
};

// End of advanced.js

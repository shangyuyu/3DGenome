//
//  utils.js
//

"use strict";

function mix(u, v, r) {
// mix vector u and v with a ratio r
    let result = [];
    for (let i=0; i<u.length; i++) {
        result.push( r*u[i] + (1-r)*v[i] );
    }

    return result;
}

// End of utils.js

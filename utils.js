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


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

// End of utils.js

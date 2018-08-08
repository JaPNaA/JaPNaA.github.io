"use strict";

function initFallback() {
    console.log("Fallback initiated");
}

window.onerror = function (e) {
    if (window.console) {
        if (console.group) {
            console.group("Error @" + this.performance.now());
            console.error(e);
            console.groupEnd();
        } else {
            console.log(e);
        }
    } else {
        if (e !== undefined) {
            alert(e);
        } else {
            alert("An error has occured");
        }
    }

    initFallback();
};

// polyfills n' stuff
if (!location.origin) {
    location.origin = location.protocol + "//" + location.host;
}

// from: https://gist.github.com/paulirish/1579671
(function () {
    var lastTime = 0;
    var vendors = ["ms", "moz", "webkit", "o"];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"]
            || window[vendors[x] + "CancelRequestAnimationFrame"];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
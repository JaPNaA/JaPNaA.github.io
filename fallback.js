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
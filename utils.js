function Utils(DT) {
    var D = {},
        stylesheet = document.createElement("style");
    DT.Utils = D;
    D.cssData = {};

    D.reloadCss = function() {
        var str = "";
        for (let query in D.cssData) {
            let rules = D.cssData[query],
                s = query + "{";

            for (let rule in rules) {
                let ruleParam = rules[rule];
                if (!ruleParam) continue;
                s += rule + ":" + ruleParam + ";";
            }

            str += s + "}";
        }
        stylesheet.innerHTML = str;
    };

    D.prompta = function(e) {
        console.log("%c" + e, "color: #F0F;");
    };

    D.setCssRule = function(query, rule, ruleParam) {
        var qd = D.cssData[query];
        if (qd) {
            qd[rule] = ruleParam;
        } else {
            D.cssData[query] = {};
            D.cssData[query][rule] = ruleParam;
        }
    };

    D.getFile = function(e, c) {
        var x = new XMLHttpRequest();
        x.open("GET", e);
        x.responseType = "text";
        x.addEventListener("load", function() {
            c(x.response);
        });
        x.send();
    };

    D.emptyElement = function(e) {
        while (e.firstChild) {
            e.removeChild(e.firstChild);
        }
    };

    D.setup = function() {
        document.head.appendChild(stylesheet);
    };

    D.easingFunctions = {
        // no easing, no acceleration
        linear: function (t) {
            return t;
        },
        // accelerating from zero velocity
        easeInQuad: function (t) {
            return t * t;
        },
        // decelerating to zero velocity
        easeOutQuad: function (t) {
            return t * (2 - t);
        },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function (t) {
            return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        // accelerating from zero velocity 
        easeInCubic: function (t) {
            return t * t * t;
        },
        // decelerating to zero velocity 
        easeOutCubic: function (t) {
            return --t * t * t + 1;
        },
        // acceleration until halfway, then deceleration 
        easeInOutCubic: function (t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        // accelerating from zero velocity 
        easeInQuart: function (t) {
            return t * t * t * t;
        },
        // decelerating to zero velocity 
        easeOutQuart: function (t) {
            return 1 - --t * t * t * t;
        },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) {
            return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
        },
        // accelerating from zero velocity
        easeInQuint: function (t) {
            return t * t * t * t * t;
        },
        // decelerating to zero velocity
        easeOutQuint: function (t) {
            return 1 + --t * t * t * t * t;
        },
        // acceleration until halfway, then deceleration 
        easeInOutQuint: function (t) {
            return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
        }
    };
}

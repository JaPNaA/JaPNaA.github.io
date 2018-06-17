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

    D.reqreqanf = function (e) {
        requestAnimationFrame(function () {
            requestAnimationFrame(e);
        });
    };

    /**
     * Creates a popup on the site
     * @param {String|Element} content popup content
     * @param {Number} [importancy = 0] how important the prompt is
     * @param {Number} [ttl] how long before the notification automatically closes, leave null for forever
     * @param {Boolean} [closeabe] can the user close the notification
     */
    D.prompta = function (content, importancy, ttl, closeable) {
        // create element
        var prompta = document.createElement("div"),
            parent = DT.Site.notificationList,
            originalHeight = 0;

        prompta.classList.add("prompta");

        // fill element
        if (content.constructor == String) {
            prompta.innerHTML = content;
        } else {
            prompta.appendChild(content);
        }

        switch (importancy) {
            default:
            case 0:
                // info, on notifications
                prompta.classList.add("info");
                break;
            case 1:
                // warning, on notifications, brighter colors
                prompta.classList.add("warn");
                break;
            case 2:
                // important, on notifications, very bright colors
                prompta.classList.add("error");
                break;
            case 3:
                // success, like info, but lime
                prompta.classList.add("success");
                break;
            case 4: // special
                // very important, blocks other actions
                prompta.classList.add("block");
                break;
        }

        if (parent.firstChild) {
            parent.insertBefore(prompta, parent.firstChild);
        } else {
            parent.appendChild(prompta);
        }
        
        originalHeight = prompta.clientHeight;
        prompta.style.height = 0;
        D.reqreqanf(function () {
            prompta.classList.add("show");
            prompta.style.height = originalHeight + "px";

            addEventListener("transitionend", function () {
                prompta.style.height = "auto";
            }, { once: true });
        });

        return {
            close: function () {
                // close prompt
            }
        }; // utility functions
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

    D.parseSearch = function(search) {
        var r = {},
            s = decodeURIComponent(search.slice(1)),
            ss = s.split("?");
        
        for (let i of ss) {
            let ix = i.indexOf("="),
                q = i.slice(0, ix),
                v = i.slice(ix + 1);
            
            if (q && v) {
                r[q] = v;
            }
        }

        return r;
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

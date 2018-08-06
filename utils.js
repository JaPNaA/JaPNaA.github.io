"use strict";

function c_Utils(DT) {
    var D = {},
        stylesheet = document.createElement("style");
    DT.Utils = D;
    D.cssData = {};

    D.reloadCss = function() {
        var str = "";
        for (var query in D.cssData) {
            var rules = D.cssData[query],
                s = query + "{";

            for (var rule in rules) {
                var ruleParam = rules[rule];
                if (!ruleParam) continue;
                s += rule + ":" + ruleParam + ";";
            }

            str += s + "}";
        }
        stylesheet.innerHTML = str;
    };

    D.writeUrl = function (e) {
        history.replaceState(null, null, e);
    };

    D.reqreqanf = function (e) {
        requestAnimationFrame(function () {
            requestAnimationFrame(e);
        });
    };

    /**
     * Creates a popup on the site
     * @param {String|Element} content popup content
     * @param {Number} [importancy] how important the prompt is
     * @param {Number} [ttl] how long before the notification automatically closes, leave null for forever
     * @param {Boolean} [unclosable] can the user close the notification
     * @returns {Object} Tools to interact with prompta
     */
    D.prompta = function (content, importancy, ttl, unclosable) {
        // create element
        var prompta = document.createElement("div"),
            parent = DT.Site.notificationList,
            contentElm = document.createElement("div"),
            originalHeight = 0,
            closed = false,
            thisUtils = { // utility functions
                close: function () {
                    if (this.closed) return;
                    this.closed = true;

                    prompta.classList.remove("show");
                    prompta.style.height = 0;
                    prompta.addEventListener("transitionend", function () { // close symbol can also trigger this, but it won't since the transition on prompta is shorter than the close.
                        parent.removeChild(prompta);
                    }, { once: true });
                },
                elm: prompta
            };

        prompta.classList.add("prompta");
        contentElm.classList.add("content");

        // give element content
        if (content.constructor === String) {
            contentElm.innerHTML = content;
        } else {
            contentElm.appendChild(content);
        }

        switch (importancy) {
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
        default: // unclassified
            break;
        }

        if (!unclosable) {
            // add class
            prompta.classList.add("closeable");

            // create close button
            var button = document.createElement("img");
            button.src = "close-button.svg";
            button.type = "image/svg+xml";

            button.classList.add("close");

            prompta.appendChild(button);

            button.addEventListener("click", function () {
                thisUtils.close();
            });
            button.addEventListener("mouseover", function () {
                DT.Site.writeHeadHint(1, "<div>Icons made by <a href=\"https://www.flaticon.com/authors/google\" title=\"Google\">Google</a> from <a href=\"https://www.flaticon.com/\" title=\"Flaticon\">www.flaticon.com</a> is licensed by <a href=\"http://creativecommons.org/licenses/by/3.0/\" title=\"Creative Commons BY 3.0\" target=\"_blank\">CC 3.0 BY</a> / Compressed from original</div>", 5000);
            });
        }

        if (ttl) {
            setTimeout(function () {
                thisUtils.close();
            }, ttl);
        }
        
        if (parent.firstChild) {
            parent.insertBefore(prompta, parent.firstChild);
        } else {
            parent.appendChild(prompta);
        }

        prompta.appendChild(contentElm);

        originalHeight = prompta.clientHeight;
        prompta.style.height = 0;
        D.reqreqanf(function () {
            prompta.classList.add("show");
            prompta.style.height = originalHeight + "px";

            addEventListener("transitionend", function () {
                prompta.style.height = "auto";
            }, { once: true });
        });

        return thisUtils;
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
        var result = {},
            searchStr = decodeURIComponent(search.slice(1)),
            strs = searchStr.split("?"),
            sl = strs.length;
        
        for (var i = 0; i < sl; i++) {
            var str = strs[i];

            var ix = str.indexOf("="),
                key = str.slice(0, ix),
                value = str.slice(ix + 1);
            
            if (key && value) {
                result[key] = value;
            }
        }

        return result;
    };

    D.rChar = function() {
        return String.fromCharCode(Math.floor(Math.random() * 128));
    };

    D.rStr = function(length) {
        var r = "";
        for (var i = 0; i < length; i++) {
            r += D.rChar();
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

    return D;
}

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

    D.setup = function() {
        document.head.appendChild(stylesheet);
    };
}

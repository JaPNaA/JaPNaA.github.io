function Utils(DT) {
    var D = {
            typeWeights: {
                "title": 2,
                "name": 2,
                "no": 5,
                "tags": 2
            }
        },
        stylesheet = document.createElement("style");
    DT.Utils = D;
    D.cssData = {};

    (function() {
        function sort(content, keywords) {
            var t = [],
                kw = getKeywords(keywords);

            for (let i of content) {
                t.push({
                    d: i,
                    v: getScore(kw, parseContent(i))
                });
            }

            return t.sort((x, y) => y.v - x.v).map(e => e.d);
        }
        D.searchSort = sort;

        function parseContent(d) {
            var r = [];
            for (let i in d) {
                let c = d[i];

                if (typeof c === "object") {
                    if (Array.isArray(c)) {
                        c = c.join(" ");
                    } else {
                        c = JSON.stringify(c);
                    }
                } else if (typeof c === "number") {
                    c = c.toString();
                } else {
                    c += "";
                }

                // content, weight
                r.push([c.toLowerCase(), D.typeWeights[i] || 2]);
            }
            return r;
        }

        function getScore(keywords, content) {
            var total = 0;
            for (let c of content) {
                for (let i of keywords) {
                    let cs = 0, cp = c[0].split(/\s/gi);
                    for (let k of cp) {
                        let score = DamerauLevenshteinDistance(c[0], i);
                        if (score) {
                            cs += Math.pow(c[0].length - score, 2);
                        }
                    }
                    total += cs * c[1];  // mutiply by weight
                }
            }
            return total;
        }

        function getKeywords(s) {
            return s.toLowerCase().split(/\s/gi);
        }

        function DamerauLevenshteinDistance(s1, s2) {
            var l1 = s1.length,
                l2 = s2.length,
                d = [],
                c, de, rt, sb;

            if (!l1) {
                if (l2) {
                    return s2.length;
                }
                return 0;
            }

            if (!l2) {
                if (l1) {
                    return s1.length;
                }
                return 0;
            }

            for (let i = 0; i < l1 + 1; i++) {
                d[i] = [];
                for (let j = 0; j < l2 + 1; j++) {
                    d[i][j] = 0;
                }
            }

            for (let i = 0; i <= l1; i++)
                d[i][0] = i;

            for (let i = 0; i <= l2; i++)
                d[0][i] = i;

            for (let i = 1; i <= l1; i++) {
                for (let j = 1; j <= l2; j++) {
                    if (s1[i - 1] === s2[j - 1]) {
                        c = 0;
                    } else {
                        c = 1;
                    }

                    de = d[i - 1][j] + 1;
                    rt = d[i][j - 1] + 1;
                    sb = d[i - 1][j - 1] + c;

                    d[i][j] = Math.min(de, Math.min(rt, sb));

                    if (
                        i > 1 && j > 1 &&
                    s1[i - 1] === s2[j - 2] &&
                    s1[i - 2] === s2[j - 1]
                    ) {
                        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + c);
                    }
                }
            }

            return d[l1][l2];
        }
    }());

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

    D.setup = function() {
        document.head.appendChild(stylesheet);
    };
}

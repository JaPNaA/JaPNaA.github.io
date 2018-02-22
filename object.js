try {
    // "Compile" function will send data here.
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

    function obj(e) {
        switch (e.type) {
            case "card":
                return iCard(e);
                break;
            case "text":
                return iText(e);
            default:
                console.warn(
                    e,
                    "is: not formatted correctly, corrupt, or not an object."
                );
        }
    }

    function fRead(e) {
        var f = [],
            h = [];
        e.data.forEach(function (o, i, a) {
            if (o.hidden) {
                h.push(o);
                return;
            }
            var j = obj(o);
            a[i].element = j;
            f.push(j);
        });
        for (let i of h) {
            e.data.splice(e.data.indexOf(i), 1);
        }
        return f;
    }

    function iCard(e) {
        try {
            var f = document.createElement("a");
            f.target = "_blank";
            f.classList.add("item", "card");
            isMobile || f.classList.add("displayOpen");
            if (e.content.notMobileCompatible && isMobile) {
                f.classList.add("notMobileCompatible");
            }

            {
                let a = document.createElement("b");
                a.classList.add("title");
                a.innerHTML = e.name;
                f.appendChild(a);
            } {
                let a = document.createElement("div");
                a.classList.add("cardTag");
                a.innerHTML = e.tags.join(", ");
                f.appendChild(a);
            } {
                let a = document.createElement("div");
                a.classList.add("desc");
                a.innerHTML = e.content.description;
                f.appendChild(a);
            } {
                let a = document.createElement("div");
                a.classList.add("display");

                for (let i of e.content.display) {
                    switch (i.type) {
                        case "img":
                            {
                                let b = document.createElement("img");
                                b.src = i.src;
                                b.title = i.caption;
                                if (i.style) {
                                    b.style = i.style;
                                }
                                a.appendChild(b);
                                break;
                            }
                        case "iframe":
                            {
                                let b = document.createElement("img");
                                b.src = i.alt.src;
                                b.title = i.alt.caption;
                                if (i.style) {
                                    b.style = i.alt.style;
                                }
                                a.appendChild(b);
                                break;
                            }
                        default:
                            console.warn(
                                e,
                                o,
                                "unkown item. @function iCard 'display'"
                            );
                    }
                }

                f.appendChild(a);
            } {
                let a = document.createElement("div"),
                    m = "";
                a.classList.add("timestamp");

                if (e.timestamp) {
                    m += new Date(e.timestamp).toLocaleDateString();
                    if (e.updated) {
                        m += " - " + new Date(e.updated).toLocaleDateString();
                    }
                }

                a.innerHTML = m;
                f.appendChild(a);
            } {
                let a = document.createElement("div");
                a.classList.add("author");
                a.innerHTML = e.author.join(", ");
                f.appendChild(a);
            }
            if (e.style) {
                f.style = e.style;
            }
            if (e.content.link) {
                f.href = e.content.link;
            }

            fScript(f, e);
            return f;
        } catch (er) {
            var g = $("<div class='item card ierror " + (isMobile ? "" : "displayOpen")  + "'>");
            g.innerHTML =
                "<b> An error occurred while trying the parse the card.<br> </b><code>" +
                er.toString() +
                "<br>" +
                JSON.stringify(e) +
                "</code>";
            g.onclick = function () {
                shortPrompta("feedback");
            };
            console.error(er);
            return g;
        }
    }

    function iText(e) {
        try {
            var f = document.createElement("div");
            f.classList.add("text", "item");
            isMobile || f.classList.add("displayOpen");

            {
                let a = document.createElement("b");
                a.classList.add("title");
                if (e.title) {
                    a.innerHTML = e.title;
                }
                f.appendChild(a);
            } {
                let a = document.createElement("div");
                a.innerHTML = e.content;
                f.appendChild(a);
            } {
                let a = document.createElement("div"),
                    m = "";
                a.classList.add("timestamp");

                if (e.timestamp) {
                    m += new Date(e.timestamp).toLocaleDateString();
                    if (e.updated) {
                        m += " - " + new Date(e.updated).toLocaleDateString();
                    }
                }

                a.innerHTML = m;
                f.appendChild(a);
            }
            fScript(f, e);
            return f;
        } catch (er) {
            var g = $("<div class='item card ierror " + (isMobile ? "" : "displayOpen") + "'>");
            g.innerHTML =
                "<b> An error occurred while trying the parse the card.<br> </b><code>" +
                e.toString() +
                "<br>" +
                JSON.stringify(e) +
                "</code>";
            g.onclick = function () {
                shortPrompta("feedback");
            };
            return g;
        }
    }

    function fScript(e, g) {
        var f = g.events;
        if (!f) return;
        f.forEach(function (o) {
            var a;
            eval("a=" + o[1]);
            e.addEventListener(o[0], a);
        });
        g.script && eval(g.script);
        (function () {
            var a = g.style.split(";");
            a.forEach(function (o) {
                if (o) {
                    var b = o.split(":");
                    e.style[b[0]] = b[1];
                }
            });
        })();
    }

    function fAnimate(e, f) {
        $("#content").appendChild(e);
        if (e.animate) {
            setTimeout(() => {
                e.animate(
                    [{
                            opacity: 0,
                            top: "64px"
                        },
                        {
                            opacity: 1,
                            top: 0
                        }
                    ], {
                        duration: 750,
                        iterations: 1,
                        easing: "ease"
                    }
                );
                e.classList.remove("displayOpen");
            }, f);
        } else {
            e.classList.remove("displayOpen");
        }
    }
} catch (e) {
    console.error(e);
    try {
        prompta(e);
    } catch (e) {}
    dt.fallback.push(!1);
} finally {
    dt.fallback.push(!0);
}
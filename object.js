try {
    // "Compile" function will send data here.
    var displayOpenD = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )
        ? ""
        : " displayOpen";

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
        var f = [];
        e.data.forEach(function(o, i, a) {
            if(o.hidden) return;
            var j = obj(o);
            a[i].element = j;
            f.push(j);
        });
        return f;
    }

    function iCard(e) {
        try {
            var f = $(
                "<a target='_blank' class='item card" + displayOpenD + "'>"
            );
            f.innerHTML =
                "<b class=title>" +
                e.name +
                "</b><div class='cardTag'>" +
                e.tags.join(", ") +
                "</div>" +
                (function() {
                    return (
                        "<div class=desc>" +
                        e.content.description +
                        "</div><div class=display>" +
                        (function() {
                            var f = "";
                            e.content.display.forEach(function(o) {
                                switch (o.type) {
                                    case "img":
                                        f +=
                                            '<img src="' +
                                            o.src +
                                            '" title="' +
                                            o.caption +
                                            '" style="' +
                                            o.style +
                                            '">';
                                        break;
                                    case "iframe":
                                        f +=
                                            '<img src="' +
                                            o.alt.src +
                                            '" title="' +
                                            o.alt.caption +
                                            '" style="' +
                                            o.alt.style +
                                            '">';
                                        break;
                                    default:
                                        console.warn(
                                            e,
                                            o,
                                            "unkown item. @function iCard 'display'"
                                        );
                                }
                            });
                            return f;
                        })() +
                        "</div>" +
                        "<div class=timestamp>" +
                        (e.timestamp
                            ? new Date(e.timestamp).toLocaleDateString()
                            : "") +
                        "</div> <div class=author>" +
                        e.author.join(", ") +
                        "</div>"
                    );
                })();
            f.style = e.style || "";
            e.content.link && (f.href = e.content.link);
            fScript(f, e);
            return f;
        } catch (er) {
            var f = $("<div class='item card ierror " + displayOpenD + "'>");
            f.innerHTML =
                "<b> An error occurred while trying the parse the card.<br> </b><code>" +
                er.toString() +
                "<br>" +
                JSON.stringify(e) +
                "</code>";
            f.onclick = function() {
                shortPrompta("feedback");
            };
            return f;
        }
    }

    function iText(e) {
        try {
            var f = $("<div class='item text " + displayOpenD + "'>");
            f.innerHTML =
                "<b class=title>" +
                (e.title || "") +
                "</b>" +
                (e.content || "") +
                "<div class=timestamp>" +
                (e.timestamp
                    ? new Date(e.timestamp).toLocaleDateString()
                    : "") +
                "</div>";
            fScript(f, e);
            return f;
        } catch (er) {
            var f = $("<div class='item card ierror " + displayOpenD + "'>");
            f.innerHTML =
                "<b> An error occurred while trying the parse the card.<br> </b><code>" +
                e.toString() +
                "<br>" +
                JSON.stringify(e) +
                "</code>";
            f.onclick = function() {
                shortPrompta("feedback");
            };
            return f;
        }
    }

    function fScript(e, g) {
        var f = g.events;
        if (!f) return;
        f.forEach(function(o) {
            var a;
            eval("a=" + o[1]);
            e.addEventListener(o[0], a);
        });
        g.script && eval(g.script);
        (function() {
            var a = g.style.split(";");
            a.forEach(function(o) {
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
                    [
                        {
                            opacity: 0,
                            top: "64px"
                        },
                        {
                            opacity: 1,
                            top: 0
                        }
                    ],
                    {
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

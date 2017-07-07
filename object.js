// "Compile" function will send data here.
function obj(e) {
    switch (e.type) {
        case "card":
            return iCard(e);
            break;
        case "text":
            return iText(e);
        default:
            console.warn(e,
                "is: not formatted correctly, corrupt, or not an object.");
    }
}

function fRead(e) {
    var a = JSON.parse(e),
        f = [];
    a.data.forEach(function(o) {
        f.push(obj(o));
    });
    return f;
}

function iCard(e) {
    var f = $("<div class='item card"+((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))?"":" displayOpen").toString()+"'>");
    f.innerHTML = "<b class=title>" + e.name + "</b><div class='cardTag'>" + e.tags
        .join(", ") +
        "</div>" + (function() {
            return "<div class=desc>" + e.content.description +
                "</div><div class=display>" + (function() {
                    var f = "";
                    e.content.display.forEach(function(o) {
                        switch (o.type) {
                            case "img":
                                f += '<img src=' + o.src +
                                    ' title="' + o.caption +
                                    '" style="' + o.style +
                                    '">';
                                break;
                            default:
                                console.warn(e, o,
                                    "unkown item. @function iCard 'display'"
                                )
                        }
                    });
                    return f;
                }()) + "</div>"+"<div class=timestamp>"+(e.timestamp?new Date(e.timestamp).toLocaleDateString():"")+"</div> <div class=author>"+e.author.join(", ")+"</div>";
        }());
    f.style=e.style||"";
    e.content.link && (f.onclick = function() {
        open(e.content.link);
    });
    fScript(f, e);
    return f;
}

function iText(e) {
    var f = $("<div class='item text "+((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))?"":" displayOpen").toString()"+'>");
    f.innerHTML = "<b class=title>"+(e.title||"")+"</b>"+(e.content||"");
    fScript(f, e);
    return f;
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
    e.style = g.style;
}

function fAnimate(e, f) {
    $("#content").appendChild(e);
    setTimeout(() => {
        e.animate([{
            opacity: 0,
            top: "64px"
        }, {
            opacity: 1,
            top: 0
        }], {
            duration: 750,
            iterations: 1,
            easing: "ease"
        });
        e.classList.remove("displayOpen");
    }, f);
}

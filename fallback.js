var initFallback=function(){
var $ = {
    id: function(e){
        return document.getElementById(e);
    },
    class: function(e){
        if(document.getElementsByClassName){
            return document.getElementsByClassName(e);
        } else if(document.querySelectorAll){
            return document.querySelectorAll("."+e);
        } else if(document.querySelector){
            return [document.querySelector("."+e)];
        } else {
            return;
        }
    },
    tag: function(e){
        if(document.getElementsByTagName){
            return document.getElementsByTagName(e);
        } else if(document.querySelectorAll){
            return document.querySelectorAll(e);
        } else if(document.querySelector){
            return [document.querySelector(e)];
        } else {
            return;
        }
    }
}
function fAnimate(e, f) {
    $.id("content").appendChild(e);
    e.classList.remove("displayOpen");
}
function getFile(e, c) {
    var xhttp = new XMLHttpRequest();
    xhttp.overrideMimeType("text/plain")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            c(this.responseText);
        }
        if (this.status > 499) {
            c("~#Failed to load content");
        }
    };
    xhttp.onerror = function() {
        c("~#Failed to load content");
    };
    xhttp.open("GET", e, true);
    xhttp.send();
}

function errorReloadCountdown(t, e) {
    var g = new Date().getTime() + (t * 1000);
    setInterval(function() {
        if (e) e.innerHTML = (function() {
            var a = g - new Date().getTime();
            if (a < 0) {
                location.reload();
                fdt.reloadAttempts += 1;
            }
            return a;
        }()) + "ms";
    }, 37);
}

function compile(e, t) {
    var f = "";
    if(t=="cxt"){
        if (e.substr(0, 2) == "~#") {
            console.log(e.substr(2, e.length));
            prompta(
                f =
                "[Something went wrong, check console for more details]<br>Reloading in... <span id=errorReloadCount></span>"
            );
            setTimeout(function() {
                if (fdt.reloadAttempts < 3) {
                    errorReloadCountdown(3, $.id('errorReloadCount'));
                } else {
                    $.id('errorReloadCount')[0].innerHTML =
                        "Too many <a href=# class=reload>reload</a> attempts";
                    $.class('reload')[0].addEventListener('click', function(){
                        location.reload();
                    },true);
                }
            });
            document.title = "JaPNaA - Error Occurred"
        } else {
            fdt.reloadAttempts = 0;
            f = fRead(e.toString());
            f.forEach(function(o, i) {
                fAnimate(o,1);
            });
        }
    } else {
        console.log(t, "is not a valid file type. @function compile.");
    }
    if (typeof f == "string") return f;
}

function prompta(e, f) {
    if (!f) {
        var a = document.createElement("div"),
            v = (dt.prompta.now++)+1,
            t = !!dt.prompta.list.length,
            l = document.createElement("div");
        dt.prompta.list.push(v);
        a.innerHTML = e;
        a.classList.add('prompta');
        a.setAttribute('promptav', v);
        l.classList.add("promptaLO");
        l.setAttribute('promptalov', v);
        l.onclick=function() {
            prompta(this.getAttribute('promptalov') - 1 + 1, 1);
        };
        document.body.appendChild(l);
        document.body.appendChild(a);
        a.style&&(a.style.top = "64px");
        a.style&&(a.style.left = "64px");
        $.tag("ev").classList.add('prompta');
        return v;
    } else {
        var a = dt.prompta.list.indexOf(e),
            b;
        if (a || a === 0) {
            if (a > -1) {
                dt.prompta.list.splice(a, 1);
            }
            b = document.querySelector("[promptav='" + e + "']");
            document.body.removeChild(b);
            document.body.removeChild(document.querySelector("[promptalov='" + e + "']"));
        }
        if (!dt.prompta.list.length) {
            $.tag('ev').classList.remove('prompta')
        }
    }
}

(function() {
    var dt = {
        prompta: {
            list: [],
            now: 0
        }
    }
    window.dt = dt;
    if(JSON&&JSON.parse){
        var fdt=JSON.parse((localStorage&&localStorage.JaPNaASDT)||"{}")
    } else {
        eval("var fdt = "+ (localStorage.JaPNaASDT || "{}"));
    }
    window.fdt = fdt;
}());

function obj(e) {
    if(e.type=="card"){
        return iCard(e);
    } else if(e.type=="text"){
        return iText(e);
    } else {
        console.log(e+"is: not formatted correctly, corrupt, or not an object.")
    }
}

function fRead(e) {
    var a, f = [];
    if(JSON&&JSON.parse){
        a=JSON.parse(e);
    } else {
        eval("a="+e);
    }
    for(var i=0; i<a.data.length; i++){
        f.push(obj(a.data&&a.data[i]));
    }
    return f;
}

function iCard(e) {
    var f = (function(){
        var a=document.createElement("div");
        a.classList.add("item");
        a.classList.add("card");
        return a;
    }());
    f.innerHTML = "<b class=title>" + e.name + "</b><div class='cardTag'>" +
        e.tags
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
                }()) + "</div>" + "<div class=timestamp>" + (e.timestamp ?
                    new Date(e.timestamp).toLocaleDateString() : "") +
                "</div> <div class=author>" + e.author.join(", ") +
                "</div>";
        }());
    f.style = e.style || "";
    if(e.content.link){
        (f.onclick = function() {
            open(e.content.link);
        });
    }
    fScript(f, e);
    return f;
}

function iText(e) {
    var f = (function(){
        var a=document.createElement("div");
        a.classList.add("item");
        a.classList.add("card");
        return a;
    }());
    f.innerHTML = "<b class=title>" + (e.title || "") + "</b>" + (e.content ||
        "");
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
    (function() {
        var a = g.style.split(";");
        a.forEach(function(o) {
            if (o) {
                var b = o.split(":");
                e.style[b[0]] = b[1];
            }
        });
    }());
}

window.onbeforeunload=function() {
    if(localStorage&&JSON){
        localStorage.JaPNaASDT = JSON.stringify(fdt);
    }
};
(function() {
    $.id("content").innerHTML = "Loading content..."
    $.id("content").classList.add('loading');
    getFile(
        'content.json' + (function(){
            if(Date&&Math){
                var f="?d=";
                if(Date){
                    if(new Date().getTime){
                        f+=new Date().getTime();
                    }
                    if(Math.random){
                        f+=Math.random();
                    }
                    return f;
                }else{
                    return "";
                }
            }
        }()),
        function(e) {
            $.id("content").innerHTML = "";
            compile(e, "cxt");
            $.id("content").classList.remove("loading");
        });
}());
}
try { //Fallback
    if (!(dt.fallback && (function() {
            var f = !0;
            if(dt.fallback.length){
                dt.fallback.forEach(function(o) {
                    if (!o) f = !1;
                });
            } else {
                f=!1;
            }
            return f;
        }()))) {
        var a =
            "An error has occured... I'm sure you know that already.<br>If this is your first time reciving this error, please reload.<br>If you have gotten this error before, please use <b> Chrome, Firefox, or Safari </b> and update your browsers.<br> If you still get errors, <a href='https://github.com/JaPNaA/JaPNaA.github.io/issues/new'>tell me</a>!<br>https://github.com/JaPNaA/JaPNaA.github.io/issues/new";
        console.log(a);
        prompta(a);
        initFallback();
    }
    dt.fallback=[];
}catch(e){
    initFallback();
}

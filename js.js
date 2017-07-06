function getFile(e, c) {
    var xhttp = new XMLHttpRequest();
    xhttp.overrideMimeType("text/plain")
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            c(this.responseText);
        }
        if (this.status >= 500) {
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
    var g = new Date().getTime() + (t * 1e3);
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
    switch (t) {
        case "cxt": //complie to f;
            if (e.substr(0, 2) == "~#") {
                console.log(e.substr(2, Infinity));
                prompta(
                    f =
                    "[Something went wrong, check console for more details]<br>Reloading in... <span id=errorReloadCount></span>"
                );
                setTimeout(function() {
                    if (fdt.reloadAttempts < 3) {
                        errorReloadCountdown(3, $('#errorReloadCount',
                            "last"));
                    } else {
                        $('#errorReloadCount', 1).innerHTML =
                            "Too many <a href=# class=reload>reload</a> attempts";
                        $('a.reload', 1).addEventListener('click', () =>
                            location.reload());
                    }
                });
                document.title = "JaPNaA - Error Occurred"
            } else {
                fdt.reloadAttempts = 0;
                f = fRead(e.toString());
                f.forEach(function(o, i) {
                    fAnimate(o, i * 100);
                });
            }
            break;
        default:
            console.warn(t, "is not a valid file type. @function compile.");
    }
    if (typeof f == "string") return f;
}

function prompta(e, f) {
    if (!f) {
        var a = $("<div>"),
            v = ++dt.prompta.now,
            t = !!$("[promptav]") && !!dt.prompta.list.length,
            l = $("<div>");
        dt.prompta.list.push(v);
        a.innerHTML = e;
        a.classList.add('prompta');
        a.setAttribute('promptav', v);
        a.addEventListener('mousedown', function() {
            this.setAttribute('dragging', !0);
        }, true);
        a.addEventListener('mouseup', function() {
            this.removeAttribute('dragging');
        }, true);
        addEventListener('mousemove', function(e) {
            if (a && a.getAttribute('dragging')) {
                a.style.top = a.style.top.replace('px', "") - 1 + 1 + e
                    .movementY + "px";
                a.style.left = a.style.left.replace('px', "") - 1 + 1 +
                    e.movementX + "px";
            }
        }, false);
        a.addEventListener("touchmove", function(e) {
            this.style.position = "fixed";
            var t = e.targetTouches[0];
            e.target.style.left = t.pageX - this.clientWidth / 2 + 'px';
            e.target.style.top = t.pageY - this.clientHeight / 2 + 'px';
            e.preventDefault();
        }, true);
        a.addEventListener("touchstart", function(e) {
            this.setAttribute('dragging', !0);
        }, {
            capture: false,
            passive: true
        });
        a.addEventListener("touchend", function() {
            this.removeAttribute('dragging');
        }, {
            capture: false,
            passive: true
        });
        l.classList.add("promptaLO");
        l.setAttribute('promptalov', v);
        l.addEventListener('click', function() {
            prompta(this.getAttribute('promptalov') - 1 + 1, 1);
        }, true);
        document.body.appendChild(l);
        document.body.appendChild(a);
        a.style.top = innerHeight / 2 - a.clientHeight / 2 + "px";
        a.style.left = innerWidth / 2 - a.clientWidth / 2 + "px";
        $("ev").classList.add('prompta');
        return v;
    } else {
        var a = dt.prompta.list.indexOf(e),
            b;
        if (a || a === 0) {
            if (a > -1) {
                dt.prompta.list.splice(a, 1);
            }
            b = $("[promptav='" + e + "']");
            b.style.transform = "scale(0.5)";
            b.style.opacity = 0;
            setTimeout(function() {
                $('body').removeChild(b);
            }, 200);
            document.body.removeChild($("[promptalov='" + e + "']"));
        }
        if (!dt.prompta.list.length) {
            $('ev').classList.remove('prompta')
        }
    }
}

(function() {
    var dt = {
        version: "0.1.8", //VERSION
        prompta: {
            list: [],
            now: 0
        },
        touchmove:{
            lY: undefined,
            sI: 0
        }
    }
    window.dt = dt;
    var fdt = Object.assign({
        reloadAttempts: 0
    }, JSON.parse(localStorage.JaPNaASDT || "{}"));
    window.fdt = fdt;
    if (fdt.fdtV != dt.version) {
        if (fdt.fdtV) {
            prompta(
                "Welcome back! An update has occurred since you last visited.<br>Last visit: " +
                fdt.fdtV + "<br> Current Version: " + dt.version +
                "<br> Changelog: <pre class=changelog>Loading...</pre>"
            );
            getFile(
                'changelog.txt?d=' + new Date().getTime() + Math.random(),
                function(e) {
                    if ($(".changelog")) $(".changelog").innerHTML = e;
                });
        }
        fdt.fdtV = dt.version;
    }
    if (innerWidth < 280) {
        prompta(
            "Your device's screen may be too small to display this webpage correctly..."
        );
    }
}());
(function() {
    if (!navigator.userAgent.includes('Firefox')) { //Buggy if Firefox
        addEventListener('scroll', function(e) {
            if ($("body").scrollTop < 1) {
                $("#head").style.position = "absolute";
                $("#head").style.top = "";
            }
        }, false);
    }
    addEventListener('wheel', function(e) {
        if (e.deltaY < 0) {
            $("#head").style.top = "0px";
        } else {
            $("#head").style.top = "-68px";
        }
        $("#head").style.position = "fixed";
    }, {
        passive: true,
        capture: false
    });
    addEventListener("touchmove", function(e) {
        var cY = e.touches[0].clientY, d=dt.touchmove;
        clearInterval(d.sI);
        if(cY > d.lY){
            d.sI=setTimeout(function() {
                $("#head").style.top = "0px";
            },10);
        }else if(cY <= d.lY){
            $("#head").style.top = "-68px";
        }
        $("#head").style.position = "fixed";
        d.lY = cY;
    }, {
        passive: true,
        capture: false
    });
    addEventListener('beforeunload', function() {
        localStorage.JaPNaASDT = JSON.stringify(fdt);
    });
    $('.JaPNaAT').addEventListener('auxclick', function() {
        this.setAttribute('contentEditable', !0);
        this.focus();
    }, true);
    $('.JaPNaAT').addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, true);
    $('.JaPNaAT').addEventListener('blur', function() {
        this.removeAttribute('contentEditable');
    }, false);
    $('.JaPNaAT').addEventListener('keydown', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            this.blur();
        }
    }, false);
}());

(function() {
    $("#content").innerHTML = "Loading content..."
    $("#content").classList.add('loading');
    getFile(
        'content.json?d=' + new Date().getTime() + Math.random(),
        function(e) {
            $("#content").innerHTML = "";
            compile(e, "cxt");
            $("#content").classList.remove("loading");
        });
}());

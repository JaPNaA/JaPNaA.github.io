try {
    function getFile(e, c) {
        var xhttp = new XMLHttpRequest();
        xhttp.overrideMimeType("text/plain");
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
                if (typeof e == "string") {
                    console.log(e.substring(2, e.length));
                    prompta(
                        f =
                        "[Something went wrong, check console for more details]<br>Reloading in... <span id=errorReloadCount></span>"
                    );
                    setTimeout(function() {
                        if (fdt.reloadAttempts < 3) {
                            errorReloadCountdown(3, $(
                                '#errorReloadCount',
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
                    f = fRead(e);
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
                    a.style.top = a.style.top.replace('px', "") - 1 + 1 +
                        e
                        .movementY + "px";
                    a.style.left = a.style.left.replace('px', "") - 1 +
                        1 +
                        e.movementX + "px";
                }
            }, false);
            a.addEventListener("touchmove", function(e) {
                this.style.position = "fixed";
                var t = e.targetTouches[0];
                e.target.style.left = t.clientX - this.clientWidth / 2 +
                    'px';
                e.target.style.top = t.clientY - this.clientHeight / 2 +
                    'px';
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

    function shortPrompta(e){
        switch (e) {
            case "feedback":
                open("https://github.com/JaPNaA/JaPNaA.github.io/issues/new","feedbackPop","width=1080, height=600, left="+((screen.width-1080)/2)+", top="+((screen.height-600)/2));
                break;
            case "changelog":
                prompta(
                    "Welcome back! An update has occurred since you last visited.<br>Last visit: " +
                    fdt.fdtV + "<br> Current Version: " + dt.version +
                    "<br> Changelog: <pre class=changelog>Loading...</pre>"
                );
                getFile(
                    'changelog.txt?d=' + new Date().getTime() + Math.random(),
                    function(e) {
                        if ($(".changelog")) $(".changelog").innerHTML =
                            e;
                    });
                break;
            default:
                prompta(e);
        }
    }

    (function() {
        var dt = {
            version: "0.2.5", //VERSION
            prompta: {
                list: [],
                now: 0
            },
            scroll: document.documentElement.scrollTop,
            orient: {
                alpha: 0,
                beta: 0,
                gamma: 0,
                t: 0
            },
            searchV: "",
            content: {},
            fallback: []
        }
        window.dt = dt;
        var fdt = Object.assign({
            reloadAttempts: 0
        }, JSON.parse(localStorage.JaPNaASDT || "{}"));
        window.fdt = fdt;
        if (fdt.fdtV != dt.version) {
            if (fdt.fdtV) {
                shortPrompta('changelog');
            }
            fdt.fdtV = dt.version;
        }
        if (innerWidth < 280) {
            prompta(
                "Your device's screen may be too small to display this webpage correctly..."
            );
        }
    }());
} catch (e) {
    console.error(e);
    try {
        prompta(e);
    } catch (e) {}
    dt.fallback.push(!1);
} finally {
    dt.fallback.push(!0);
    window.onerror=function(m,u,l){
        if(dt.fallback.length){
            dt.fallback.push(!1);
            prompta("Error:<br>"+[m,u,l].join("<br>"));
        } else {
            window.onerror=function(){
                dt.fallback.push(!1);
                prompta([m,u,l].join("<br>"));
            };
            initFallback();
        }
    }
}

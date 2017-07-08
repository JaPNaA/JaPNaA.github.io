try {
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
            if (!dt.prompta.list.length) {
                var cY = e.touches[0].clientY,
                    d = dt.touchmove;
                if (cY > d.lY) {
                    d.sI = setTimeout(function() {
                        $("#head").style.top = "0px";
                    }, 5);
                } else if (cY <= d.lY) {
                    $("#head").style.top = "-68px";
                    clearTimeout(d.sI);
                }
                $("#head").style.position = "fixed";
                d.lY = cY;
            }
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
} catch (e) {
    console.error(e);
    try {
        prompta(e);
    } catch (e) {}
    dt.fallback.push(!1);
} finally {
    dt.fallback.push(!0);
}

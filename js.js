try {
    addEventListener(
        "scroll",
        function(e) {
            var st =
                    document.body.scrollTop ||
                    document.documentElement.scrollTop,
                f = $("#foot");
            if (dt.scroll < st && st > 64) {
                $("#head").style.top = "-68px";
            } else {
                $("#head").style.top = "0px";
            }
            dt.scroll = st;
            if (document.body.scrollHeight - st - window.innerHeight < 64) {
                f.style.bottom = 0;
            } else {
                f.style.bottom = -f.clientHeight + "px";
            }
        },
        false
    );
    addEventListener(
        "mousemove",
        function(e) {
            if (!(e && e.path)) return;
            var f = $("#foot"),
                st =
                    document.body.scrollTop ||
                    document.documentElement.scrollTop;
            if (
                innerHeight - e.y < 8 ||
                e.path.indexOf(f) > 0 ||
                document.body.scrollHeight - st - window.innerHeight < 64
            ) {
                f.style.bottom = 0;
            } else {
                f.style.bottom = -f.clientHeight + "px";
            }
        },
        false
    );
    addEventListener(
        "deviceorientation",
        function(e) {
            var n = Date.now(),
                f = $("#foot");
            if (
                Math.abs(e.alpha - dt.orient.alpha) +
                    Math.abs(e.beta - dt.orient.beta) +
                    Math.abs(e.gamma - dt.orient.gamma) >
                n - dt.orient.t
            ) {
                f.style.bottom = 0;
            }
            dt.orient.alpha = e.alpha;
            dt.orient.beta = e.beta;
            dt.orient.gamma = e.gamma;
            dt.orient.t = n;
        },
        false
    );

    function resize() {
        if(resize.last.w == innerWidth && resize.last.h == innerHeight) {
            if(!resize.last.to) {
                resize.last.to = Date.now() + 250;
            } else {
                if (Date.now() < resize.last.to) {
                    resize.last.to = null;
                    return;
                }
            }
            requestAnimationFrame(() => resize());
            return;
        }

        let ht = "hideTags";
        if (innerWidth < 540) {
            document.body.classList.add(ht);
        } else {
            if (document.body.classList.contains(ht)) {
                document.body.classList.remove(ht);
            }
        }
    }
    resize.last = {
        w: innerWidth,
        h: innerHeight,
        to: null
    };

    addEventListener("resize", resize);
    resize();

    addEventListener("beforeunload", function() {
        localStorage.JaPNaASDT = JSON.stringify(fdt);
    });

    $("#content").innerHTML = "Loading content...";
    $("#content").classList.add("loading");
    getFile(
        "content.json?d=" + new Date().getTime() + Math.random(),
        function(e) {
            dt.content = JSON.parse(e);
            $("#content").innerHTML = "";
            compile(dt.content, "cxt");
            $("#content").classList.remove("loading");
        }
    );
} catch (e) {
    console.error(e);
    try {
        prompta(e);
    } catch (e) {}
    dt.fallback.push(!1);
} finally {
    dt.fallback.push(!0);
}

function getFile(e, c) {
    var xhttp = new XMLHttpRequest();
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
                f =
                    "[Something went wrong, check console for more details]<br>Reloading in... <span id=errorReloadCount></span>";
                setTimeout(function() {
                    if (fdt.reloadAttempts < 3) {
                        errorReloadCountdown(3, $('#errorReloadCount'));
                    } else {
                        $('#errorReloadCount').innerHTML =
                            "Too many <a href=# class=reload>reload</a> attempts";
                        $('a.reload').addEventListener('click', () =>
                            location.reload());
                    }
                });
                document.title = "JaPNaA - Error Occurred"
            } else {
                fdt.reloadAttempts = 0;
                f = e;
            }
            break;
        default:
            console.warn(t, "is not a valid file type. @function compile.");
    }
    return f;
}

function prompta(e){
    var a=$("<div>");
    a.innerHTML=e;
    a.style="position: fixed; top:0; left:0; background:white;";
    document.body.appendChild(a);
}

(function() {
    var dt = {
        version: "0.1.3"
    }
    var fdt = Object.assign({
        reloadAttempts: 0
    }, JSON.parse(localStorage.JaPNaASDT));
    if (fdt.fdtV != "0.1.3") {
        prompta(
            "Welcome back! An update has occurred since you last visited.<br>Last visit: " +
            fdt.fdtV + "<br> Current Version: " + dt.version +
            "<br> Changelog: <pre class=changelog>Loading...</pre>");
        getFile('https://raw.githubusercontent.com/JaPNaA/JaPNaA.github.io/beta/changelog.txt?d=' + // NOTE: CHANGE ADRESS BEFORE RELASE
        new Date().getTime() + Math.random(), function(e){
            if($(".changelog"))$(".changelog").innerHTML=e;
        });
    }
    window.fdt = fdt;
    window.dt = dt;
}());
(function() {
    addEventListener('scroll', function(e) {
        if ($("body").scrollTop < 1) {
            $("#head").style.position = "absolute";
            $("#head").style.top = "";
        }
    }, false);
    addEventListener('wheel', function(e) {
        if (e.deltaY < 0) {
            $("#head").style.top = "0px";
        } else {
            $("#head").style.top = "-64px";
        }
        $("#head").style.position = "fixed";
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
}());

(function() {
    $("#content").innerHTML = "Loading content..."
    $("#content").classList.add('loading');
    getFile(
        'https://raw.githubusercontent.com/JaPNaA/JaPNaA.github.io/beta/content.txt?d=' + // NOTE: CHANGE ADRESS BEFORE RELASE
        new Date().getTime() + Math.random(),
        function(e) {
            $("#content").innerHTML = compile(e, "cxt");
            $("#content").classList.remove("loading");
        });
}());

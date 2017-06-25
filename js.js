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

function getFile(e, c) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            c(this.responseText);
        }
    };
    xhttp.open("GET", e, true);
    xhttp.send();
}

function compile(e,t) {
    var f="";
    switch (t) {
        case "cxt": //complie to f;
            f=e;
            break;
        default:
            console.warn(t, "is not a valid file type. @function compile.");
    }
    return f;
}

(function() {
    $("#content").innerHTML = "Loading content..."
    $("#content").classList.add('loading');
    getFile('https://raw.githubusercontent.com/JaPNaA/JaPNaA.github.io/beta/content.txt?d='+new Date().toString(), function(e) {
        $("#content").innerHTML=compile(e,"cxt");
        $("#content").classList.remove("loading");
    });
}());

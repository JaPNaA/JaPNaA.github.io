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

(function() {
    $("#content").innerHTML = "Loading content..."
    $("#content").classList.add('loading');
}());

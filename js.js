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
    }, {passive: true, capture:false});
}());

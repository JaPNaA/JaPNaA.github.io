(function() {
    addEventListener('wheel', function(e) {
        if(e.deltaY<0){
            console.log("Scroll up");
            $("#head").style.top="0px";
        } else {
            console.log("Scroll down");
            $("#head").style.top="-64px";
        }
    }, false);
}());

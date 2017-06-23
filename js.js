document.getElementById("testJS").innerHTML = "JS is loaded.";
var f = '__';
addEventListener('keydown', function(e) {
    f += e.key;
    f = f.substr(1, 2);
    if (f.toLowerCase() == "bd" && new Date().toLocaleDateString() ==
        "6/23/2017") {
        alert("And Happy Birthday, Aryan.\nDouble-click to go fullscreen");
        document.body.innerHTML = "<fsd>HOOPY BARTHDEE, Aryan!<div>--from Leone</div></fsd>";
        document.body.classList.add('bda');
        addEventListener('resize', function() {
            document.body.style.lineHeight = document.body.clientHeight +
                "px";
        }, false);
        addEventListener('dblclick', function() {
            $("body").webkitRequestFullscreen();
        }, false);
        document.body.style.lineHeight = document.body.clientHeight +
            "px";
    }
}, false);

setInterval(()=>{
    $('#dots').innerHTML+=".";
    $("#dotSc").scrollIntoViewIfNeeded();
},45);

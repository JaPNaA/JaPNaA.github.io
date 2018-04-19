function SplashScreen(DT) {
    var D = {};
    DT.SplashScreen = D;

    var elm = document.createElement("div"),
        parent = document.body,
        sI = -1;
    elm.id = "splashScreen";

    {
        let a = document.createElement("div");
        a.innerHTML = "JaPNaA loading..."; //* spinning JaPNaASite icon
        a.classList.add("middleCenter");
        a.style.fontSize = "32px";
        elm.appendChild(a);
    }

    function initSplashScreen() {
        parent.appendChild(elm);
    }

    function remove() {
        parent.removeChild(elm);
    }

    D.setup = function() {
        initSplashScreen();
    };

    D.closeSplashScreen = function() {
        elm.classList.add("remove");
        elm.addEventListener("transitionend", function() {
            remove();
            clearInterval(sI);
        }, {
            once: true
        });

        // for browsers that may not support transitionend
        sI = setTimeout(function() {
            remove();
        }, 400);
    };
}
function SplashScreen(DT) {
    var D = {
        loadingSI: -1
    };
    DT.SplashScreen = D;

    var elm = document.createElement("div"),
        parent = document.body,
        sI = -1;
    elm.id = "splashScreen";

    {
        let a = document.createElement("div");
        a.style.position = "fixed";
        a.style.left = "50%";
        a.style.top = "40%";
        a.style.transform = "translate(-50%, -50%)";
        a.style.fontSize = "32px";
        a.style.textAlign = "center";

        {
            let b = document.createElement("div");
            b.innerHTML = "JaPNaA";
            a.appendChild(b);
        }
        {
            let b = document.createElement("div");
            b.innerHTML = "Loading...";
            D.loadingSI = setInterval(function() {
                b.innerHTML += ".";
            }, 1000);
            a.appendChild(b);
        }
        elm.appendChild(a);
    }

    function initSplashScreen() {
        parent.appendChild(elm);
    }

    function remove() {
        clearInterval(D.loadingSI);
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
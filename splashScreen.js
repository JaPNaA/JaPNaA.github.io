"use strict";

function c_SplashScreen(DT) {
    var D = {
        loadingSI: -1,
        progressBarSI: -1,
        loadingBar: null,
        loadingProgress: null
    };
    DT.SplashScreen = D;

    var elm = document.createElement("div"),
        parent = document.body,
        sI = -1;
    elm.id = "splashScreen";

    {
        var a = document.createElement("div"), b, c, d;
        a.style.position = "fixed";
        a.style.left = "50%";
        a.style.top = "40%";
        a.style.transform = "translate(-50%, -50%)";
        a.style.fontSize = "32px";
        a.style.textAlign = "center";

        {
            b = document.createElement("div");
            b.innerHTML = "JaPNaA";
            b.classList.add("title");
            a.appendChild(b);
        }
        {
            b = document.createElement("div");
            b.classList.add("loadingText");
            b.innerHTML = "Loading...";
            // D.loadingSI = setInterval(function() {
            //     b.innerHTML += ".";
            // }, 1000);
            a.appendChild(b);
        }
        { // add something to check if loadingbar is possible
            b = document.createElement("div");
            b.classList.add("loadingStatus");

            {
                c = document.createElement("div");
                c.classList.add("loadingBar");

                {
                    d = document.createElement("div");
                    d.classList.add("loadingProgress");
                    D.loadingProgress = d;
                    c.appendChild(d);
                }

                D.loadingBar = c;
                b.appendChild(c);
            }

            a.appendChild(b);
        }
        elm.appendChild(a);
    }

    function updateLoadingBar(progress) {
        D.loadingProgress.style.width = progress * 100 + "%";
    }

    function networkProgessCheck() {
        var loaded = performance.getEntriesByType("resource").length,
            progress = loaded / 29;
        
        updateLoadingBar(progress);

        D.progressBarSI = requestAnimationFrame(networkProgessCheck);
    }


    function initSplashScreen() {
        networkProgessCheck();
        parent.appendChild(elm);
    }

    function remove() {
        clearInterval(D.loadingSI);

        // in try/catch because IE
        try {
            parent.removeChild(elm);
        } catch(e) {
            console.warn(e);
        }
    }

    D.setup = function() {
        initSplashScreen();
    };

    D.closeSplashScreen = function() {
        elm.classList.add("remove");

        elm.addEventListener("transitionend", function(e) {
            if (e.path[0] !== elm) return;
            remove();
            cancelAnimationFrame(D.progressBarSI);
            clearInterval(sI);
        }, {
            once: true
        });

        // for browsers that may not support transitionend
        sI = setTimeout(function() {
            cancelAnimationFrame(D.progressBarSI);
            remove();
        }, 400);
    };

    return D;
}
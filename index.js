(function() {
    var DT = {},
        L = null;

    try {
        L = [SplashScreen, Utils, ContentGetter, ShortUrl, SiteObjects, Site, Elasticlunr, Search, PerformanceTest];
    } catch(err) {
        location.reload(true); // add something to prevent from looping forever
        return;
    }
    
    for(let i of L) {
        i(DT);
    }
    for (let i in DT) {
        let j = DT[i];
        if (j.setup) {
            j.setup();
        }
    }

    //* for debugging
    window.DT = DT; 

    setTimeout(function () {
        for (let i = 0; i < 5; i++) {
            setTimeout(function () {
                DT.Utils.prompta(i + ": " + "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", i % 5, 0);
            }, i * 1000);
        }
    }, 1000);
}());
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
        for (let i = 0; i < 25; i++) {
            setTimeout(function () {
                DT.Utils.prompta(i.toString());
            }, i * 250);
        }
    }, 1000);
}());
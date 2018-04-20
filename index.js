(function() {
    var DT = {},
        L = null;

    try {
        L = [SplashScreen, Utils, ContentGetter, ShortUrl, SiteObjects, Site];
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

    window.DT = DT; //* for debugging
}());
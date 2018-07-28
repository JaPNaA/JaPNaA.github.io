(function() {
    var DT = {},
        L = null;

    try {
        L = [c_SplashScreen, c_Utils, c_ContentGetter, c_ShortUrl, c_SiteObjects, c_Menu, c_Site, c_Elasticlunr, c_Search, c_ServiceWorker, c_AboutPage];
    } catch(err) {
        // location.reload(true); // add something to prevent from looping forever
        throw err;
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
}());
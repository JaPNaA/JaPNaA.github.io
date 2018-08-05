(function() {
    var DT = {
        setupQue: [],
        c_: {}
    };

    var required = [
        "c_SplashScreen",

        "c_Utils",
        "c_ContentGetter",
        "c_ShortUrl",
        
        "c_SiteObjects",
        "c_Menu",
        "c_Site",
        
        "c_Elasticlunr",
        "c_Search"
    ];

    var notRequired = [
        "c_AboutPage",
        "c_ServiceWorker",
        "c_CLI"
    ];

    function load(c_name) {
        if (typeof window[c_name] !== "function") return false;

        try {
            DT.setupQue.push(window[c_name](DT));
            DT.c_[c_name] = true;
        } catch (e) {
            console.error(e);
            DT.c_[c_name] = false;
            return false;
        }
        return true;
    }

    function loadRequired() {
        for (let i = 0; i < required.length; i++) {
            let pkg = required[i];

            if (load(pkg)) {
                console.log("Loaded " + pkg);
            } else {
                console.error("Failed to load " + pkg);
            }
        }
        setupLoads();
    }

    function loadNotRequired() {
        for (let i = 0; i < notRequired.length; i++) {
            let pkg = notRequired[i];

            if (load(pkg)) {
                console.log("Loaded " + pkg);
            } else {
                console.warn("Failed to load " + pkg);
            }
        }
        setupLoads();
    }

    function setupLoads() {
        while (DT.setupQue.length) {
            let i = DT.setupQue.shift();
            if (!i) continue;
            if (i.setup) {
                i.setup();
            }
        }
    }
    
    loadRequired();

    addEventListener("load", loadNotRequired);

    //* for debugging
    window.DT = DT;
}());
// Command line interface that opens upon secret search entry
// used for stuff not as easy to do on DevTools.

function c_CLI(DT) {
    var D = {
        // Constants
        // -----------------------------------------------------------------------------
        cliPath: "/cli/index.html",     // path of index.html for CLI

        // States and variables
        // -----------------------------------------------------------------------------
        active: false,                  // is CLI active?
        loaded: false,

        window: null,                   // window property of CLI window

        // CLI data
        // -----------------------------------------------------------------------------
        commands: {                     // commands accessible by CLI
            prompta: function(str, strargs, importancy, ttl, unclosable, ...content) {
                DT.Utils.prompta(content.join(" "), parseInt(importancy), parseInt(ttl), parseInt(unclosable));
                return 0;
            },
            version: function() {
                D.window.println("Current: " + D.data.version.current);
                D.window.println("Latest: " + D.data.version.latest);
                D.window.println("Localstorage: " + D.data.version.localStorage);
                return 0;
            },
            update: function() {
                D.window.println("Force updating site");
                DT.ServiceWorker.updateSite();
                return 0;
            },
            reload: function(str, strargs, forceReload) {
                location.reload(!!parseInt(forceReload));
                return 1;
            }
        },
        helpCmd: {                      // help for commands
            prompta: "Syntax: prompta [int importancy] [int ttl] [1/0 unclosable] [string of message with spaces]",
            version: "Syntax: version\nPrints the version numbers of the site",
            update: "Syntax: update\nForce updates the site",
            reload: "Syntax: reload [1/0 forceReload]\nReloads the site"
        },

        data: {                         // data accessible by CLI, for debugging
            version: {
                current: null,
                latest: null,
                localStorage: null
            }
        }
    };
    DT.CLI = D;

    function openCLI() {
        D.window = open(D.cliPath, "cli", `top=${screenY}, left=${screenX}, width=760, height=360`, true);

        D.window.addEventListener("ready", function() {
            D.window.postMessage("parentSet: I am your father.", location.origin);
        });
    }

    function onreceivemessage(e) {
        if (e.data.startsWith("childSet:")) {
            if (D.loaded || e.source !== D.window) {
                e.source.postMessage("no.", location.origin);
                e.source.close();
                console.log("Killed child, CLI already open");
            } else {
                D.loaded = true;
                D.window.addEventListener("beforeunload", function() {
                    // reset
                    D.active = false;
                    D.loaded = false;
                    D.window = null;
                });
                console.log("CLI attached");
            }
        }
    }

    function checkAvailable() {
        return D.active && D.loaded && D.window;
    }

    function closeCLI() {
        if (checkAvailable()) {
            D.window.close();
        }
    }

    D.activate = function() {
        if (D.active) {
            DT.Utils.prompta("CLI already open!", 0, 1e4, false);
            return;
        }
        D.active = true;
        openCLI();
    };

    D.log = function(e, cls) {
        if (checkAvailable()) {
            D.window.println(e, cls);
        }
    };

    D.setup = function() {
        addEventListener("message", onreceivemessage);

        // reactive CLI when reloaded with it open
        // -----------------------------------------------------------------------------
        // if reloaded and cli is true
        if (
            performance.navigation.type === performance.navigation.TYPE_RELOAD && 
            DT.ContentGetter.localStorage["cli"]
        ) {
            D.activate();
        }
        DT.ContentGetter.writeLocalStorage("cli", false);

        addEventListener("beforeunload", function() {
            // if open, set cli to true
            if (checkAvailable()) {
                DT.ContentGetter.writeLocalStorage("cli", true);
                DT.ContentGetter.updateLocalStorage();
            }
            closeCLI();
        });
    };
}
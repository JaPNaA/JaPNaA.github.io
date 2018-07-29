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

        window: null,                    // window property of CLI window
        commands: {
            "prompta": function(str, strargs, importancy, ttl, unclosable, ...content) {
                DT.Utils.prompta(content.join(" "), parseInt(importancy), parseInt(ttl), parseInt(unclosable));
                return 0;
            }
        },
        helpCmd: {
            "prompta": "Syntax: prompta [int importancy] [int ttl] [1/0 unclosable] [string of message with spaces]"
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

    function closeCLI() {
        if (D.active && D.loaded && D.window) {
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

    D.setup = function() {
        addEventListener("message", onreceivemessage);
        addEventListener("beforeunload", closeCLI);
    };
}
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

        window: null                    // window property of CLI window
    };
    DT.CLI = D;

    function openCLI() {
        D.window = open(D.cliPath, "cli", `top=${screenY}, left=${screenX}, width=760, height=360`, true);
    }

    function onreceivemessage(e) {
        if (D.loaded) {
            // wait for childSet instruction
            console.log(e.data);
        } else {
            // process other commands
        }
    }

    D.activate = function() {
        if (D.active) return;
        D.active = true;
        openCLI();
    };

    D.setup = function() {
        addEventListener("message", onreceivemessage);
    };
}
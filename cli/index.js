"use strict";

var $input = document.getElementById("input"),
    $output = document.getElementById("output");

function cmd_echo(str, strargs) {
    println(strargs);
    return 0;
}

function cmd_eval(str, strargs, ...args) {
    var returnvalue;

    if (parent === window) {
        try {
            returnvalue = window.eval(strargs);
        } catch (err) {
            println(err.toString(), "err");
            return 0;
        }
    } else {
        try {
            returnvalue = parent.eval(strargs);
        } catch (err) {
            println(err.toString(), "err");
            return 0;
        }
    }

    if (returnvalue === null) {
        returnvalue = "null";
    } else if (returnvalue === undefined) {
        returnvalue = "undefined";
    } else if (typeof returnvalue === "object") {
        try {
            returnvalue = JSON.stringify(returnvalue);
        } catch (err) {
            println("Warning: Cannot stringify return value of eval", "wrn");
            if (returnvalue.toString) {
                returnvalue = returnvalue.toString();
            }
        }
    } else {
        try {
            returnvalue = returnvalue.toString();
        } catch (err) {
            println("Error: return value of eval does not have toString property", "err");
            return;
        }
    }

    println(returnvalue);
    return 0;
}

function cmd_update() {
    var x = new XMLHttpRequest();

    println("This is the standalone version of this command.", "wrn");

    x.open("GET", location.origin + "/reloadCache");
    x.responseType = "text";

    x.addEventListener("load", function() {
        println("Site updated with response: " + x.status + ", \"" + x.response + "\"");
    });

    x.send();
    return 0;
}

var moreHelp = {
    "echo": "Syntax: echo [string with spaces]\nThis command says whatever you want it to say",
    "eval": "Syntax: echo [string of code with spaces]\nThis command evaluates your code and prints it's return value",
    "help": "Syntax: help *[command]\nWhen given no arguments, lists all commands.\nWith a name of a command, will print it's help information.",
    "cls": "Syntax: cls\nClears the console",
    "update": "Syntax: update\nForce update JaPNaA.github.io",
    "exit": "Syntax: exit\nCloses the console. (Only works when attached to parent)"
};

function cmd_help(str, strargs, command) {
    if (command) {
        var helpStr = moreHelp[command];
        if (helpStr) {
            println(helpStr);
        } else {
            println("Help for command '" + command + "' doesn't exist", "err");
        }
    } else {
        println("Here's a list of commands available:");
        println("  " + Object.keys(cmdMap).join("\n  "));

        println("\nThis is the CLI for JaPNaA.github.io. The CLI is is tool that I created to assist myself in developing my site. It contains commands that cause things to happen on my site. For example: prompta, to create a prompt on the site; update, to force an update on my site; etc.");
    }
    return 0;
}

function cmd_exit() {
    window.close();
    return 1;
}

var cmdMap = {
    "echo": cmd_echo,
    "eval": cmd_eval,
    "help": cmd_help,
    "cls": clearConsole,
    "update": cmd_update,
    "exit": cmd_exit
};

function processCommand(str) {
    var args = str.split(/\s/),
        command = args.shift(),
        
        func = cmdMap[command],
        
        firstSpace = str.match(/\s/),
        strargs = firstSpace ? str.slice(firstSpace.index) : "";

    if (!str) return;

    if (func) {
        var termCode = func(str, strargs, ...args);
        if (termCode !== 0) {
            println("Process exited with code: " + termCode, "err");
        }
    } else {
        println("Command doesn't exist", "err");
    }
}

function inputValue(e) {
    println(e, "inp");
    processCommand(e);
} 

function println(e, cls) {
    var elm = document.createElement("div");
    if (e) {
        elm.innerText = e;
    } else {
        elm.classList.add("empty");
    }
    elm.classList.add(cls);
    $output.appendChild(elm);
    return 0;
}

function clearConsole() {
    while ($output.firstChild) {
        $output.removeChild($output.firstChild);
    }
    return 0;
}

$input.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
        var val = $input.value;
        $input.value = "";
        inputValue(val);

        if (val !== commandHistory[0] && val) {
            commandHistory.unshift(val);
        }
        historyIx = -1;

        resizeAndScrollToInput();
        e.preventDefault();
    }
});

println("This is the JaPNaA.github.io CLI.");
println("JaP is kewl.");

$input.focus();

function resizeAndScrollToInput() {
    $input.style.height = "1em"; // allow input to reduce size
    $input.style.height = $input.scrollHeight + "px";
    
    scrollBy(0, $input.getBoundingClientRect().bottom);
}
resizeAndScrollToInput();

addEventListener("resize", resizeAndScrollToInput);
$input.addEventListener("input", resizeAndScrollToInput);

var commandHistory = [];
var historyIx = -1;

addEventListener("keydown", function(e) {
    $input.focus();

    if (
        commandHistory.length > 0 && 
        (e.keyCode === 38 || e.keyCode === 40)
    ) {
        // register stroke
        if (e.keyCode === 38) {
            // up
            historyIx++;
        } else if (e.keyCode === 40) {
            // down
            historyIx--;
        }
    
        // validate
        if (historyIx < -1) {
            historyIx = -1;
        } else if (historyIx >= commandHistory.length) {
            historyIx = commandHistory.length - 1;
        }

        // update input
        if (historyIx === -1) {
            $input.value = "";
        } else {
            $input.value = commandHistory[historyIx];
        }
    }
});

addEventListener("load", function() {
    // change url to something prettier
    history.replaceState(null, null, location.origin + "/cli/");
});

// connection to parent
// -----------------------------------------------------------------------------

var parent = null;

function setupParentCommands(key) {
    for (var i in parent[key].commands) {
        cmdMap[i] = parent[key].commands[i];
    }
    for (var i in parent[key].helpCmd) {
        moreHelp[i] = parent[key].helpCmd[i];
    }

    parent.postMessage("gotAPIs", location.origin);

    println("Received parent APIs!", "suc");
}

function msg_parentSet(e, args) {
    parent = e.source;
    println("Attached to parent!", "suc");
}

function msg_exposeKey(e, args) {
    setupParentCommands(args);
}

var msgCommandMap = {
    parentSet: msg_parentSet,
    exposeKey: msg_exposeKey
};

function parseMessage(e) {
    var splitIx = e.data.indexOf(":"),
        command, args;

    if (splitIx < 0) {
        command = e.data;
    } else {
        command = e.data.slice(0, splitIx);
        args = e.data.slice(splitIx + 1);
    }

    var func = msgCommandMap[command];
    if (func) {
        func(e, args);
    } else {
        println("Failed to parse message from parent:\n" + e.data, "err");
    }
}

addEventListener("message", function(e) {
    parseMessage(e);
});

window.dispatchEvent(new Event("ready"));

if (!window.opener) {
    println("Not attached to parent!", "err");
    println("Some commands will not be available.", "wrn");
} else {
    opener.postMessage("childSet: Dad?", location.origin);
}
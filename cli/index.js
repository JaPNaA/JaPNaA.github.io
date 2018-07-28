// console.log("load");

// addEventListener("message", function (e) {
//     console.log(e.data);
//     parent.postMessage("childSet: Hello?");
// });

// dispatchEvent(new Event("ready"));

const $input = document.getElementById("input"),
    $output = document.getElementById("output");

function cmd_echo(str, strargs) {
    println(strargs);
    return 0;
}

function cmd_eval(str, strargs, ...args) {
    var returnvalue;
    try {
        returnvalue = window.eval(strargs);
    } catch (err) {
        println(err.toString(), "err");
        return 0;
    }

    if (returnvalue === null) {
        returnvalue = "null";
    } else if (returnvalue === undefined) {
        returnvalue = "undefined";
    } else {
        returnvalue = returnvalue.toString();
    }

    println(returnvalue);
    return 0;
}

const cmdMap = {
    "echo": cmd_echo,
    "eval": cmd_eval
};

function processCommand(str) {
    var args = str.split(/\s/),
        command = args.shift(),
        
        func = cmdMap[command],
        
        firstSpace = str.match(/\s/),
        strargs = firstSpace ? str.slice(firstSpace.index) : "";

    if (!str) return;

    if (func) {
        let termCode = func(str, strargs, ...args);
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
}

$input.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
        var val = $input.value;
        $input.value = "";
        inputValue(val);

        resizeAndScrollToInput();
        e.preventDefault();
    }
});

println("This is the JaPNaA.github.io CLI.");
println("JaP is kewl.");

$input.focus();

function resizeAndScrollToInput() {
    $input.style.height = $input.scrollHeight + "px";
    scrollBy(0, $input.getBoundingClientRect().bottom)
}
resizeAndScrollToInput();

addEventListener("resize", resizeAndScrollToInput);
$input.addEventListener("input", resizeAndScrollToInput);

addEventListener("keydown", function() {
    $input.focus();
});
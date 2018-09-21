"use strict";

function c_Search(DT) {
    var D = {
        // Search button
        // -----------------------------------------------------------------------------
        button: null, // search button
        buttonData: {
            active: false, // is searching
            aniframe: 0,
            anitime: 350,
            then: 0,
            oPos: null,
            paddTop: 10,
            aniactive: false
        },

        // Data
        // -----------------------------------------------------------------------------
        content: null,          // content/0.json

        searchConfig: {         // config to pass through search library
            fields: {
                "title": {boost: 2},
                "body": {boost: 1},
                "no": {boost: 5},
                "tags": {boost: 2},
                "author": {boost: 2},
                "caption": {boost: 1}
            },
            bool: "AND",
            expand: true
        },
        
        // States and variables
        // -----------------------------------------------------------------------------
        active: false,          // if searching is active
        hasOninput: false,      // can attach 'input' event listener

        sI: -1,                 // timer to prevent searching every key
        timeout: 250,           // time to wait before searching

        inputElm: null,         // <input> in head for user input
        index: null,            // index outputed from search library
        linput: null,           // last input

        results: [],            // search results from library
        parsedItems: {}         // elements already created from a search result
    };
    DT.Search = D;

    /**
     * Converts content JSON file entries to elasticlunr entries
     * @param {String} id id of indexing doc
     * @param {Object} dt item from content JSON files
     * @returns {Object} indexing doc
     */
    function translateIndex(id, dt) {
        switch(dt.type) {
        case "card":
            var captions = [],
                dl = dt.content.display.length;
            for (var i = 0; i < dl; i++) {
                captions.push(dt.content.display[i].caption);
            }

            return {
                id: id,
                title: dt.name,
                body: dt.content.description,
                author: dt.author.join(" "),
                tags: dt.tags.join(" "),
                no: dt.no,
                caption: captions.join(" ")
            };
        case "text":
            return {
                id: id,
                title: dt.title,
                body: dt.content,
                author: null,
                tags: null,
                no: null,
                caption: null
            };
        }
    }

    function getResultItem(id) {
        // check if it's been parsed before
        if (D.parsedItems[id] !== undefined) {
            return D.parsedItems[id];
        }

        var splitId = id.split(":"),
            fileIndex = parseInt(splitId[0]),
            itemIndex = parseInt(splitId[1]);

        var elm = DT.SiteObjects.parseResult(
            D.content[fileIndex].data[itemIndex]
        );

        D.parsedItems[id] = elm;
        return elm;
    }

    function addResult(e) {
        var result = getResultItem(e.ref);
        if (result) {
            result.appendTo(DT.Site.searchOverlay);
        }
    }

    D.updateResults = function () {
        if (!D.active) return;
        var results = D.search(D.input),
            rl = results.length;
        D.results = results;

        DT.Utils.emptyElement(DT.Site.searchOverlay);

        for (var i = 0; i < rl; i++) {
            addResult(results[i]);
        }

        if (!results.length) {
            DT.Site.writeHeadHint(0, "No results found");
        } else {
            DT.Site.clearHeadHint();
        }

        DT.Utils.writeUrl(location.origin + "/?search=" + encodeURIComponent(D.input));
    };

    /**
     * Handler for when the value in search changes
     */
    function changeHandler() {
        if (D.input === D.linput) return;
        D.linput = D.input;
        DT.Utils.emptyElement(DT.Site.searchOverlay);

        if (D.input.length > 1) {
            D.sI = setTimeout(function () {
                D.updateResults();
            }, D.timeout);
        } else {
            DT.Utils.writeUrl(location.origin);
        }
    }

    /**
     * Keydown handler for search input
     * @param {KeyboardEvent} e event
     */
    function keydownHandler(e) {
        if (e.keyCode === 13) {
            // activates secret cli, for experiments
            if (D.input.toLowerCase() === "$cli") {
                if (DT.c_["c_CLI"]) {
                    DT.CLI.activate(); 
                } else {
                    DT.Utils.prompta("c_CLI is not loaded", 2, 0, false);
                }
                D.setActive(false);
                return;
            }

            if (D.input.length < 2) {
                DT.Site.writeHeadHint(0, "Input length must be more than 1");
                return;
            }
            console.log("enter");

            D.updateResults(); // enter forces search
            return;
        }

        if (D.input.length >= 1) {
            DT.Site.clearHeadHint();
        }

        clearTimeout(D.sI);
        changeHandler();
    }

    /**
     * Global keydown handler (only when active)
     * @param {KeyboardEvent} e event
     */
    function gActiveKeydownHandler(e) {
        if (!D.active) return;

        D.inputElm.focus();

        if (e.keyCode === 27) {
            DT.Site.clearHeadHint();
            D.setActive(false);
        }
    }

    /**
     * Global keydown handler (also runs while not active)
     * @param {KeyboardEvent} e event
     */
    function gKeydownHandler(e) {
        if (e.ctrlKey && e.keyCode === 70) {
            e.preventDefault();
            D.setActive(true);
        }
    }

    function focusHandler() {
        if (!D.active) {
            this.blur();
        }
    }

    /**
     * Registers all event event listeners
     */
    function registerHandlers() {
        if ("oninput" in D.inputElm) {
            D.hasOninput = true;
            D.inputElm.addEventListener("input", changeHandler);
        } else {
            D.inputElm.addEventListener("keyup", changeHandler);
            D.inputElm.addEventListener("change", changeHandler);
        }

        D.inputElm.addEventListener("keydown", keydownHandler);
        addEventListener("keydown", gActiveKeydownHandler);
    }

    function unregisterHandlers() {
        if (D.hasOninput) {
            D.inputElm.removeEventListener("input", changeHandler);
        } else {
            D.inputElm.removeEventListener("keyup", changeHandler);
            D.inputElm.removeEventListener("change", changeHandler);
        }

        D.inputElm.removeEventListener("keydown", keydownHandler);
        removeEventListener("keydown", gActiveKeydownHandler);        
    }

    function load() {
        for (var i = 0; i < D.content.length; i++) {
            var chunk = D.content[i];
            for (var j = 0; j < chunk.data.length; j++) {
                D.index.addDoc(translateIndex(i + ":" + j, chunk.data[j]));
            }
        }
    }

    D.search = function(e) {
        return D.index.search(e, D.searchConfig);
    };

    D.initSearch = function(e) {
        if (e) {
            if (D.active) return;
            D.active = true;

            registerHandlers();

            if (D.input.length <= 13) {
                D.input = "";
                DT.Utils.emptyElement(DT.Site.searchOverlay);
            }

            D.inputElm.focus();
        } else {
            D.active = false;
            
            unregisterHandlers();

            D.inputElm.blur();
        }
    };

    // Search button
    // -----------------------------------------------------------------------------
    // animation

    function button_updPos() {
        D.button.style.transform =
            "translateY(" +
            DT.Utils.easingFunctions.easeInOutQuad(D.buttonData.aniframe) 
              * -D.buttonData.oPos +
            "px)";
    }

    function button_reqanf(now) {
        var bd = D.buttonData,
            tt = now - bd.then;

        bd.then = now;

        if (bd.active) {
            bd.aniframe += tt / bd.anitime;
            if (bd.aniframe > 1) {
                bd.aniframe = 1;
                bd.aniactive = false;
                button_updPos();
                return;
            }
        } else {
            bd.aniframe -= tt / bd.anitime;
            if (bd.aniframe < 0) {
                bd.aniframe = 0;
                bd.aniactive = false;
                button_updPos();
                return;
            }
        }
        
        button_updPos();
        bd.aniactive = true;
        requestAnimationFrame(button_reqanf);
    }

    function button_startAni() {
        if (D.buttonData.aniactive) return;
        D.buttonData.then = performance.now();
        requestAnimationFrame(button_reqanf);
    }

    function button_updState() {
        if (D.buttonData.oPos === null) {
            D.buttonData.oPos = D.button.getBoundingClientRect().top - D.buttonData.paddTop;
        }

        if (D.buttonData.active) {
            DT.Site.main.classList.add("searching");
            DT.Search.initSearch(true);
            D.requestAllData();
        } else {
            DT.Site.main.classList.remove("searching");
            DT.Search.initSearch(false);

            DT.Utils.writeUrl(location.origin);
            DT.Site.clearHeadHint();
        }

        button_startAni();
    }
    
    function button_click() {
        D.buttonData.active = !D.buttonData.active;

        button_updState();

        if (D.buttonData.aniactive) {
            console.log("clicked while animating!");
        }
    }

    D.setActive = function(val) {
        D.buttonData.active = val;
        button_updState();
    };

    // called when the searchbutton is created in siteobjects.js
    D.initSearchButton = function(e) {
        D.button = e;
        D.button.addEventListener("click", button_click);
    };

    function onGetAllData() {
        D.content = DT.ContentGetter.siteContent.content;
        load();
    }

    function onLoadedIndex() {
        var allreqs = DT.ContentGetter.siteContent.getAllContent(),
            required = allreqs.length,
            done = 0;

        function _checkDone() {
            done++;
            if (done >= required) {
                onGetAllData();
            }
        }

        for (var i = 0; i < allreqs.length; i++) {
            var req = allreqs[i];
            req.addEventListener("load", _checkDone);
        }
        _checkDone(); // in case of 0 required
    }

    D.requestAllData = function() {
        console.log("requesting for all data");
        if (DT.ContentGetter.siteContent.loadedIndex) {
            onLoadedIndex();
        } else {
            DT.ContentGetter.siteContent.addEventListener("index", onLoadedIndex);
        }
    };

    // setup
    // -----------------------------------------------------------------------------
    D.setup = function () {
        D.button = DT.Menu.menuItems.search;
        // DT.ContentGetter.add("content", "content/0.json", true, function (e) {
        //     D.content = e;
        //     load();
        // }, "json");

        D.index = DT.Elasticlunr(function() {
            this.addField("title");
            this.addField("body");
            this.addField("author");
            this.addField("tags");
            this.addField("no");
            this.addField("caption");            
            
            this.setRef("id");

            this.saveDocument(false);
        });

        D.inputElm = document.createElement("input");
        D.inputElm.id = "searchInput";
        D.inputElm.type = "text";
        D.inputElm.placeholder = "Enter query...";
        D.inputElm.value = "";

        D.inputElm.addEventListener("focus", focusHandler);

        DT.Site.head.appendChild(D.inputElm);

        Object.defineProperty(D, "input", {
            get: function() {
                return D.inputElm.value;
            },
            set: function(e) {
                D.inputElm.value = e;
            }
        });

        // if search query in url, init search
        if (DT.Site.search.search) {
            addEventListener("load", function () {
                DT.Search.setActive(true);
                DT.Search.input = DT.Site.search.search;
                DT.Search.updateResults();
            });
        }

        addEventListener("keydown", gKeydownHandler);
    };

    return D;
}
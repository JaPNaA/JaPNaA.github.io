function Search(DT) {
    var D = {
        button: null, // search button
        content: null, // content/0.json
        searchConfig: { // config to pass through search library
            fields: {
                "title": {boost: 2},
                "body": {boost: 1},
                "no": {boost: 5},
                "tags": {boost: 2},
                "author": {boost: 2},
                "caption": {boost: 1}
            },
            bool: "OR",
            expand: true
        },
        inputElm: null, // <input> in head for user input
        listening: false, // if searching is active
        results: [], // search results from library
        items: {}, // elements already created from a search result
        index: null, // index outputed from search library
        linput: null // last input
        // input: inputElm.value
    };
    DT.Search = D;

    function translateIndex(id, dt) {
        switch(dt.type) {
        case "card":
            var captions = [];
            for (let i of dt.content.display) {
                captions.push(i.caption);
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
        if (D.items[id] !== undefined) {
            return D.items[id];
        }

        let elm = DT.SiteObjects.parseResult(D.content.data[id]);
        D.items[id] = elm;
        return elm;
    }

    function addResult(e) {
        var result = getResultItem(e.ref);
        if (result) {
            result.appendTo(DT.Site.searchOverlay);
        }
    }

    D.updateResults = function () {
        //* timeout before updating, so it doesn't update every key

        var results = D.search(D.input);
        D.results = results;

        DT.Utils.emptyElement(DT.Site.searchOverlay);

        for (let i of results) {
            addResult(i);
            // console.log(new DT.SiteObjects.ResultCard(i));
        }

        if (!results.length) {
            DT.Site.writeHeadHint("No results found");
        } else {
            DT.Site.clearHeadHint();
        }
    }

    function changeHandler() {
        if (D.input === D.linput) return;
        D.linput = D.input;
        DT.Utils.emptyElement(DT.Site.searchOverlay);

        if (D.input.length > 1) {
            D.updateResults();
        }
    }

    function keydownHandler(e) {
        if (e.keyCode === 13) {
            if (D.input.length < 2) {
                DT.Site.writeHeadHint("Input length must be more than 1");
                return;
            }
            console.log("enter");

            D.updateResults(); // enter forces search
            return;
        }

        if (D.input.length >= 1) {
            DT.Site.clearHeadHint();
        }

        changeHandler();
    }

    function gKeydownHandler(e) {
        if (D.listening) {
            D.inputElm.focus();
        }
    }

    function registerHandlers() {
        D.inputElm.addEventListener("keydown", keydownHandler);
        D.inputElm.addEventListener("keyup", changeHandler);
        D.inputElm.addEventListener("change", changeHandler);
        addEventListener("keydown", gKeydownHandler);
    }
    function unregisterHandlers() {
        D.inputElm.removeEventListener("keydown", keydownHandler);
        D.inputElm.removeEventListener("keyup", changeHandler);
        D.inputElm.removeEventListener("change", changeHandler);
        removeEventListener("keydown", gKeydownHandler);        
    }

    function focusHandler() {
        if (!D.listening) {
            this.blur();
        }
    }

    function load() {
        let dl = D.content.data.length;
        for (let i = 0; i < dl; i++) {
            D.index.addDoc(translateIndex(i, D.content.data[i]));
        }
    }

    D.search = function(e) {
        return D.index.search(e, D.searchConfig);
    };

    D.initSearch = function(e) {
        if (e) {
            if (D.listening) return;
            D.listening = true;

            registerHandlers();

            if (D.input.length <= 13) {
                D.input = "";
                DT.Utils.emptyElement(DT.Site.searchOverlay);
            }

            D.inputElm.focus();
        } else {
            D.listening = false;
            
            unregisterHandlers();

            D.inputElm.blur();
        }
    };

    D.setup = function () {
        D.button = DT.Site.menuItems.search;
        DT.ContentGetter.add("content", "content/0.json", false, function (e) {
            D.content = e;
            load();
        }, "json");

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
    };
}
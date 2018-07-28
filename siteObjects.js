function c_SiteObjects(DT) {
    var D = {};
    DT.SiteObjects = D;

    /**
     * determinds the absolute path of a uri from DT.Site.path
     * @param {string} uri
     */
    function parseURIPath(uri) {
        if (uri.match(/^(\w*):\/\//)) { // matches START (any protocol)://
            return uri;
        } else {
            return DT.Site.path + uri;
        }
    }

    Image.prototype.aload = function () {
        if (this.src) return false;
        this.src = this.asrc;
        this.classList.add("load");
        return true;
    };

    class Item { // abstract item
        constructor(title, timestamp, style) {
            this.elmP = document.createElement("a");
            this.elm = document.createElement("div");
            
            {
                this.titleElm = document.createElement("div");
                this.titleElm.title = "Name #PostNo.";
                this.titleElm.classList.add("title");
                this.elm.appendChild(this.titleElm);
            } {
                this.bodyElm = document.createElement("div");
                this.bodyElm.classList.add("body");
                this.elm.appendChild(this.bodyElm);
            }
            
            this.added = false;
            
            this.imgs = [];
            this.events = {
                load: []
            };
            
            this.elmP.target = "_blank";
            this.elmP.rel = "noopener";
            this.elm.classList.add("item");
            this.elm.style = style;

            this.title = title;
            this.elmP.classList.add("itemP");
            this.elmP.appendChild(this.elm);
        }

        get content() {
            return this.bodyElm.innerHTML;
        }
        set content(e) {
            this.bodyElm.innerHTML = e;
        }

        get title() {
            return this.titleElm.innerHTML;
        }
        set title(e) {
            if (e) {
                this.titleElm.innerHTML = e;
            } else {
                this.titleElm.classList.add("nonexistent");
                this.titleElm.innerHTML = "";
            }
        }

        get parent() {
            return this.elmP.parentElement;
        }
        set parent(s) {
            this.appendTo(s);
        }

        get link() {
            return this.elmP.href;
        }
        set link(e) {
            this.elmP.href = e;
        }

        get tabindex() {
            return this.elmP.tabIndex;
        }
        set tabindex(e) {
            this.elmP.tabIndex = e;
        }

        appendTo(parent) {
            parent.appendChild(this.elmP);
        }

        addEventListener(t, f) {
            this.events[t].push(f);
        }
        dispatchEvent(t) {
            for (let i of this.events[t]) {
                i.call(this);
            }
        }

        prepAdd() {
            if (this.added) return;
            var requiredDep = this.imgs.length,
                loadedDep = 0;

            if (requiredDep) {
                for (let i of this.imgs) {
                    i.aload();
                    i.addEventListener("load", () => {
                        loadedDep++;

                        if (loadedDep >= requiredDep) {
                            this.dispatchEvent("load");
                        }
                    });
                }
            } else {
                this.dispatchEvent("load");
            }

            this.added = true;
        }
    }

    class ResultItem { // doesn't have as much as Item, because card and text have different DOM structures
        constructor(timestamp, style) {
            this.elmP = document.createElement("div");
            this.elm = document.createElement("div");
            this.expandedElm = document.createElement("div");
            
            this.imgs = [];
            this.added = false;
            this.isExpanded = false;
            this.loadedExpantion = false;
            this.expandItem = null;

            this.elm.classList.add("item");
            this.elmP.classList.add("itemP", "result");
            this.expandedElm.classList.add("expand");

            this.elm.style = style;

            this.elmP.appendChild(this.elm);
            this.elmP.appendChild(this.expandedElm);
            this.elmP.addEventListener("click", () => this.expand());
        }

        get parent() {
            return this.elmP.parentElement;
        }
        set parent(s) {
            this.appendTo(s);
        }

        appendTo(parent) {
            parent.appendChild(this.elmP);

            // when changing parents, unexpand, if expanded
            if (this.isExpanded) {
                this.unexpand();
                this.expandedElm.classList.remove("expanded");
            }
        }
        
        prepAdd() {
            if (this.added) return;
            for (let i of this.imgs) {
                i.aload();
            }
            this.added = true;
        }

        createExpandItem() {}

        unexpand() {
            this.expandedElm.removeChild(this.expandItem.elmP);
            this.elmP.style.height = "auto";
            this.elmP.classList.remove("expanded");
            this.isExpanded = false;
        }

        expand() {
            if (this.isExpanded) return;

            if (this.loadedExpantion) {
                this.expandItem.appendTo(this.expandedElm);
                this.elmP.style.height = this.expandItem.elmP.clientHeight + "px";
                this.expandedElm.classList.add("expanded");
            } else {
                this.createExpandItem();
                this.expandItem.addEventListener("load", () => {
                    this.expandItem.appendTo(this.expandedElm);
                    this.elmP.style.height = this.expandItem.elmP.clientHeight + "px";
                });
                this.expandItem.prepAdd();

                this.expandedElm.classList.add("expanded");

                this.loadedExpantion = true;
            }

            this.elmP.classList.add("expanded");
            this.isExpanded = true;
        }
    }

    D.Text = class extends Item {
        constructor(title, content, timestamp, style) {
            super(title, timestamp, style);

            this.elm.classList.add("text");
            this.bodyElm.appendChild(content);
        }
    };

    D.Card = class extends Item {
        constructor(title, link, content, shouldFormatDescription, timestamp, tags, author, no, style) {
            super(title, timestamp, style);

            {
                this.displayElm = document.createElement("div");
                this.displayElm.classList.add("display");
                this.elm.appendChild(this.displayElm);
            } {
                this.metaElm = document.createElement("div");
                this.metaElm.classList.add("meta");
                this.elm.appendChild(this.metaElm);
            }

            this.elm.classList.add("card");
            this.link = link;
            D.parseCardMeta(timestamp, tags, author, no, this);
            D.parseCardContent(content, this, shouldFormatDescription);
        }
    };

    D.ResultText = class extends ResultItem { //* when clicked, expand to full card
        constructor(title, content, timestamp, style) {
            super(timestamp, style);

            {
                this.titleElm = document.createElement("div");
                this.titleElm.classList.add("title");
                this.elm.appendChild(this.titleElm);
            } {
                this.bodyElm = document.createElement("div");
                this.bodyElm.classList.add("body");
                this.elm.appendChild(this.bodyElm);
            }
            
            this.titleElm.innerHTML = title;
            this.bodyElm.innerHTML = content.innerText.substr(0, 200); // cut off at 200 characters

            if (content.length > 200) {
                this.bodyElm.innerHTML += "...";
            }

            this.args = [].slice.call(arguments);

            this.elm.classList.add("text");
        }

        createExpandItem() {
            this.expandItem = new D.Text(...this.args);
        }
    };

    D.ResultCard = class extends ResultItem {
        constructor(title, link, content, shouldFormatDescription, timestamp, tags, author, no, style) {
            super(timestamp, style);

            // structure
            {
                this.leftCol = document.createElement("div");
                this.leftCol.classList.add("left", "col");
                this.elm.appendChild(this.leftCol);

                {
                    this.imgElm = document.createElement("div");
                    this.imgElm.classList.add("img");
                    this.leftCol.appendChild(this.imgElm);
                }
            } {
                this.rightCol = document.createElement("div");
                this.rightCol.classList.add("right", "col");
                this.elm.appendChild(this.rightCol);

                {
                    this.titleElm = document.createElement("div");
                    this.titleElm.classList.add("title");
                    this.rightCol.appendChild(this.titleElm);
                } {
                    this.bodyElm = document.createElement("div");
                    this.bodyElm.classList.add("body");
                    this.rightCol.appendChild(this.bodyElm);
                }
            }

            // content
            // right
            this.titleElm.innerHTML = title;
            this.titleElm.setAttribute("no", no);
            this.bodyElm.appendChild(D.parseDescriptionContent(content.description, shouldFormatDescription));
            // left
            if (content.display[0]) {
                this.imgElm.appendChild(D.parseDisplayContent(content.display[0], this.imgs));
            }

            this.args = [].slice.call(arguments);

            this.elm.classList.add("card");

            this.prepAdd();
        }

        createExpandItem() {
            this.expandItem = new D.Card(...this.args);
        }
    };

    D.ErrorCard = class {
        constructor(msg) {
            this.elm = document.createElement("div"); {
                this.titleElm = document.createElement("div");
                this.titleElm.classList.add("title");
                this.elm.appendChild(this.titleElm);
            } {
                this.bodyElm = document.createElement("div");
                this.bodyElm.classList.add("body");
                this.elm.appendChild(this.bodyElm);
            }
            this.elm.classList.add("item", "error");
            this._parent = null;

            this.title = "Error parsing this card.";
            this.content = msg;
        }

        get content() {
            return this.bodyElm.innerHTML;
        }
        set content(e) {
            this.bodyElm.innerHTML = e;
        }

        get title() {
            return this.titleElm.innerHTML;
        }
        set title(e) {
            if (e) {
                this.titleElm.innerHTML = e;
            } else {
                this.titleElm.classList.add("nonexistent");
                this.titleElm.innerHTML = "";
            }
        }

        get parent() {
            return this._parent;
        }
        set parent(s) {
            this.appendTo(s);
        }

        appendTo(parent) {
            this._parent = parent;
            parent.appendChild(this.elm);
        }
    };

    D.parseDisplayContent = function (dt, imgs) {
        switch (dt.type) {
        case "img": {
            let r = document.createElement("img");
            r.asrc = parseURIPath(dt.src);
            r.title = dt.caption;
            imgs.push(r);
            return r;
        }
        case "iframe":
            return D.parseDisplayContent(dt.alt, imgs);
        default: {
            let r = document.createElement("div");
            r.innerHTML = "Error! <br><b>Reason:</b> Item is of unknown type";
            return r;
        }
        }
    };

    D.parseCardContent = function (dt, that, shouldFormatDescription) {
        {
            let description = document.createElement("div"); // create element
            description.appendChild(D.parseDescriptionContent(dt.description, shouldFormatDescription)); // set element content
            that.bodyElm.appendChild(description); // push to body
        } {
            let display = document.createElement("div");
            for (let i of dt.display) { // for every item in display
                display.appendChild(D.parseDisplayContent(i, that.imgs));
            }
            that.displayElm.appendChild(display);
        }
    };

    D.parseCardMeta = function (dtTimestamp, dtTags, dtAuthor, dtNo, that) {
        that.titleElm.setAttribute("no", dtNo); // set number attribute to title

        {
            let tags = document.createElement("div"); // create element
            tags.innerHTML = dtTags.join(", "); // set content to tags
            tags.title = "You can search these terms";
            tags.classList.add("tags");
            that.metaElm.appendChild(tags);
        } {
            let author = document.createElement("div");
            author.innerHTML = dtAuthor.join(", ");
            author.title = "These are the people that created this\n(It's only me ik)";
            author.classList.add("author");
            that.metaElm.appendChild(author);
        } {
            let timestamp = document.createElement("div");
            timestamp.innerHTML = new Date(dtTimestamp).toLocaleDateString();
            timestamp.title = "Time this was posted.\nAutomatically adjusted to locale timezone.\n\nMilliseconds since Jan 1, 1970 12:00AM/0:00 (UTC +0): \n" + dtTimestamp.toString();
            timestamp.classList.add("timestamp");
            that.metaElm.appendChild(timestamp);
        }
    };

    D.parseText = function (dt) {
        return new D.Text (
            dt.title,
            D.parseDescriptionContent(dt.content, dt.jsformat), // format string for ${{js}}, if required
            dt.timestamp,
            dt.style
        );
    };
    D.parseCard = function (dt) {
        return new D.Card (
            dt.name,
            parseURIPath(dt.content.link),
            dt.content,
            dt.jsformat,
            dt.timestamp,
            dt.tags,
            dt.author,
            dt.no,
            dt.style
        );
    };

    // parseResult is for a result from search.js
    D.parseResultText = function (dt) {
        return new D.ResultText (
            dt.title,
            D.parseDescriptionContent(dt.content, dt.jsformat), // format string for ${{js}}, if required
            dt.timestamp,
            dt.style
        );
    };
    D.parseResultCard = function (dt) {
        return new D.ResultCard (
            dt.name,
            parseURIPath(dt.content.link),
            dt.content,
            dt.jsformat,
            dt.timestamp,
            dt.tags,
            dt.author,
            dt.no,
            dt.style
        );
    };

    D.parse = function (dt) {
        if (dt.hidden) return null;
        switch (dt.type) {
        case "text":
            return D.parseText(dt);
        case "card":
            return D.parseCard(dt);
        default:
            return new D.ErrorCard("Reason: Card is of unknown type");
        }
    };

    D.parseResult = function (dt) {
        if (dt.hidden) return null;
        switch (dt.type) {
        case "text":
            console.log(dt);
            return D.parseResultText(dt);
        case "card":
            console.log(dt);
            return D.parseResultCard(dt);
        default:
            return new D.ErrorCard("Reason: Card is of unknown type");
        }
    };

    D.parseDescriptionContent = function (content, formatjs) {
        var formatted = document.createElement("div");

        // ${{ js }}
        // --------------------------------------------------------------------------------
        if (formatjs) { // if requires formatting
            let regex = /\${{(.+?)}}/g, // matches ${{ anything }}
                matches = [], // list of all matches
                formattedTo = 0, // index of how far the string has formatted to
                formattedStr = ""; // formatted string to return

            while (true) { // push match to matches until there're no more matches
                let match = regex.exec(content);

                if (match) { // format on the way
                    let result = eval("(function() {" + match[1] + "}());"); // evaluated result

                    if (result === null) { // there's no null.toString or undefined.toString, so
                        result = "null";
                    } else if (result === undefined) {
                        result = "undefined";
                    } else { // convert to string
                        result = result.toString();
                    }

                    // add where the last format was, to current format
                    formattedStr += content.slice(formattedTo, match.index) + result;

                    // move formattedTo to end of match
                    formattedTo = match.index + match[0].length;
                } else {
                    break;
                }
            }

            formatted.innerHTML = formattedStr + content.slice(formattedTo);
        } else {
            formatted.innerHTML = content;
        }

        // <a href="link" rel="noopener" target="_blank">
        // --------------------------------------------------------------------------------
        {
            let links = formatted.getElementsByTagName("a");
            for (let i = 0; i < links.length; i++) {
                let link = links[i];

                link.rel = "noopener";
                link.target = "_blank";
            }
        }

        return formatted;
    };

    D.separator = function () {
        return document.createElement("hr");
    };

    //* very hack-y should be fixed
    D.search_open = function () {
        // WHY DOES THE SEARCH BUTTON CONTROL THE SEARCHING CLASS? (when there's a js file dedicated to search)
        DT.Site.main.classList.add("searching");
        DT.Search.initSearch(true);
    };

    //* very hack-y should be fixed
    D.search_close = function () {
        // WHY DOES THE SEARCH BUTTON CONTROL THE SEARCHING CLASS? (when there's a js file dedicated to search)
        DT.Site.main.classList.remove("searching");
        DT.Search.initSearch(false);

        // WHY DOES THE SEARCH BUTTON CONTROL THE URL
        DT.Utils.writeUrl(location.origin);
        DT.Site.clearHeadHint();
    };

    //* very hack-y should be fixed
    D.searchButton = function () {
        var e = document.createElement("div"),
            active = false, // state: button is active
            aniframe = 0,
            anitime = 350,
            then = 0,
            oPos = null,
            paddTop = 10,
            aniactive = false;

        function startAni() {
            if (aniactive) return;
            then = performance.now();
            requestAnimationFrame(reqanf);
        }
        function updPos() {
            e.style.transform =
                "translateY(" +
                DT.Utils.easingFunctions.easeInOutQuad(aniframe) * -oPos +
                "px)";
        }

        function reqanf(now) {
            var tt = now - then;
            then = now;
            if (active) {
                aniframe += tt / anitime;
                if (aniframe > 1) {
                    aniframe = 1;
                    aniactive = false;
                    updPos();
                    return;
                }
            } else {
                aniframe -= tt / anitime;
                if (aniframe < 0) {
                    aniframe = 0;
                    aniactive = false;
                    updPos();
                    return;
                }
            }
            updPos();
            aniactive = true;
            requestAnimationFrame(reqanf);
        }

        e.classList.add("searchItem");

        {
            let a = document.createElement("div");
            a.classList.add("searchButton");

            {
                let b = document.createElement("div"); // create search text
                b.innerHTML = "Search";
                b.classList.add("text");

                a.appendChild(b);
            } {
                let b = document.createElement("div"); // create icon
                b.classList.add("img");

                {
                    let c = document.createElement("img");
                    c.src = "img/searchIcon.png";
                    c.alt = "search icon";
                    b.appendChild(c);
                }

                a.appendChild(b);
            }

            e.appendChild(a);
        }

        // TODO: move this to the search.js file
        function clickHandler() {
            active ^= true;

            if (oPos === null) {
                oPos = e.getBoundingClientRect().top - paddTop;
            }

            if (active) {
                D.search_open();
            } else {
                D.search_close();
            }

            if (aniactive) {
                console.log("clicked while animating!");
            }
            startAni();
        }

        //* very hack-y should be fixed
        e.setActive = function(val) {
            active = !val;
            clickHandler();
        };

        // automated search with url
        if (DT.Site.search.search) {
            addEventListener("load", () => {
                clickHandler();
                DT.Search.input = DT.Site.search.search;
                DT.Search.updateResults();
            });
        }

        e.addEventListener("click", clickHandler);

        return e;
    };


    D.yearList = function () {
        var group = document.createElement("group");

        DT.ContentGetter.add("content", "content/0.json", true, function (e) {
            var data = e.data,
                first = new Date(data[data.length - 1].timestamp).getFullYear(),
                last = new Date(data[0].timestamp).getFullYear();

            for (let i = last; i >= first; i--) {
                let a = document.createElement("div");
                a.innerHTML = i;
                group.appendChild(a);
            }

            group.dispatchEvent(new Event("load"));
        }, "json");

        return group;
    };
}

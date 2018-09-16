"use strict";

function c_SiteObjects(DT) {
    var D = {};
    DT.SiteObjects = D;

    /**
     * determinds the absolute path of a uri from DT.Site.path
     * @param {string} uri uri to parse
     * @returns {string} parsed uri path
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
        DT.ContentGetter.networkTracker.newRequest();

        this.addEventListener("load", function () {
            DT.ContentGetter.networkTracker.loadedRequest();
        });

        this.addEventListener("error", function () {
            DT.ContentGetter.networkTracker.loadedRequest();
        });

        this.src = this.dataset.src;
        this.classList.add("load");
        return true;
    };

    /**
     * abstract item
     * @class
     * @param {String} title title of item
     * @param {Number} timestamp time item was posted
     * @param {String} style cssString to apply to item
     */
    function Item(title, timestamp, style) {
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
        this.elm.style.cssText = style;

        this.title = title;
        this.elmP.classList.add("itemP");
        this.elmP.appendChild(this.elm);
    }

    Object.defineProperties(Item.prototype, {
        content: {
            get: function () {
                return this.bodyElm.innerHTML;
            },

            set: function (e) {
                this.bodyElm.innerHTML = e;
            }
        },
        title: {
            get: function () {
                return this.titleElm.innerHTML;
            },

            set: function (e) {
                if (e) {
                    this.titleElm.innerHTML = e;
                } else {
                    this.titleElm.classList.add("nonexistent");
                    this.titleElm.innerHTML = "";
                }
            }
        },
        parent: {
            get: function () {
                return this.elmP.parentElement;
            },

            set: function (s) {
                this.appendTo(s);
            }
        },
        link: {
            get: function () {
                return this.elmP.href;
            },

            set: function (e) {
                this.elmP.href = e;
            }
        },
        tabindex: {
            get: function () {
                return this.elmP.tabIndex;
            },

            set: function (e) {
                this.elmP.tabIndex = e;
            }
        }
    });

    Item.prototype.appendTo = function (parent) {
        parent.appendChild(this.elmP);
    };

    Item.prototype.addEventListener = function (t, f) {
        this.events[t].push(f);
    };

    Item.prototype.dispatchEvent = function (t) {
        var handlers = this.events[t],
            hl = handlers.length;

        for (var i = 0; i < hl; i++) {
            handlers[i].call(this);
        }
    };

    Item.prototype.prepAdd = function () {
        if (this.added) return;
        var requiredDep = this.imgs.length,
            loadedDep = 0;

        if (requiredDep) {
            var il = this.imgs.length,
                that = this;

            for (var i = 0; i < il; i++) {
                var img = this.imgs[i];

                img.aload();
                img.addEventListener("load", function () {
                    loadedDep++;

                    if (loadedDep >= requiredDep) {
                        that.dispatchEvent("load");
                    }
                });
            }
        } else {
            this.dispatchEvent("load");
        }

        this.added = true;
    };

    /**
     * @class
     * @param {Number} timestamp time of result item posted
     * @param {String} style cssString applied to item
     */
    function ResultItem(timestamp, style) { // doesn't have as much as Item, because card and text have different DOM structures
        var that = this;

        this.elmP = document.createElement("div");
        this.elm = document.createElement("div");
        this.expandedElm = document.createElement("div");

        this.imgs = [];
        this.added = false;
        this.isExpanded = false;
        this.loadedExpantion = false;
        this.expandItem = null;

        this.elm.classList.add("item");
        this.elmP.classList.add("itemP");
        this.elmP.classList.add("result");
        this.expandedElm.classList.add("expand");

        this.elm.style.cssText = style;

        this.elmP.appendChild(this.elm);
        this.elmP.appendChild(this.expandedElm);
        this.elmP.addEventListener("click", function () {
            that.expand();
        });
    }

    Object.defineProperties(ResultItem.prototype, {
        parent: {
            get: function () {
                return this.elmP.parentElement;
            },
            set: function (s) {
                this.appendTo(s);
            }
        }
    });

    ResultItem.prototype.appendTo = function (parent) {
        parent.appendChild(this.elmP);

        // when changing parents, unexpand, if expanded
        if (this.isExpanded) {
            this.unexpand();
            this.expandedElm.classList.remove("expanded");
        }
    };

    ResultItem.prototype.prepAdd = function () {
        if (this.added) return;

        var il = this.imgs.length;

        for (var i = 0; i < il; i++) {
            var img = this.imgs[i];

            img.aload();
        }
        this.added = true;
    };

    ResultItem.prototype.createExpandItem = function () { };

    ResultItem.prototype.unexpand = function () {
        this.expandedElm.removeChild(this.expandItem.elmP);
        this.elmP.style.height = "auto";
        this.elmP.classList.remove("expanded");
        this.isExpanded = false;
    };

    ResultItem.prototype.expand = function () {
        if (this.isExpanded) return;

        if (this.loadedExpantion) {
            this.expandItem.appendTo(this.expandedElm);
            this.elmP.style.height = this.expandItem.elmP.clientHeight + "px";
            this.expandedElm.classList.add("expanded");
        } else {
            var that = this;
            this.createExpandItem();
            this.expandItem.addEventListener("load", function () {
                that.expandItem.appendTo(that.expandedElm);
                that.elmP.style.height = that.expandItem.elmP.clientHeight + "px";
            });
            this.expandItem.prepAdd();

            this.expandedElm.classList.add("expanded");

            this.loadedExpantion = true;
        }

        this.elmP.classList.add("expanded");
        this.isExpanded = true;
    };

    /**
     * @class
     * @extends Item
     * @param {String} title title of text
     * @param {String} content content of text
     * @param {Number} timestamp time of posting text
     * @param {String} style cssString of style to apply to text
     */
    // @ts-ignore, false positive //*
    D.Text = function (title, content, timestamp, style) {
        Item.call(this, title, timestamp, style);

        this.elm.classList.add("text");
        this.bodyElm.appendChild(content);
    };

    D.Text.prototype = Object.create(Item.prototype);
    D.Text.prototype.constructor = D.Text;

    /**
     * @class
     * @extends Item
     * @param {String} title title of text
     * @param {String} link link card links to
     * @param {String} content card content
     * @param {Boolean} shouldFormatDescription if the description should be formatted for ${{}}
     * @param {Number} timestamp time of posting card
     * @param {String[]} tags tags of card
     * @param {String} author authors of what card shows
     * @param {Number} no card number
     * @param {String} style cssString of style to apply to card
     */
    // @ts-ignore, false positive //*
    D.Card = function (title, link, content, shouldFormatDescription, timestamp, tags, author, no, style) {
        Item.call(this, title, timestamp, style);

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
    };

    D.Card.prototype = Object.create(Item.prototype);
    D.Card.prototype.constructor = D.Card;

    /**
     * @class
     * @extends ResultItem
     * @param {String} title title of item
     * @param {HTMLDivElement} content content of item
     * @param {Number} timestamp time of posting item
     * @param {String} style cssString of card style
     */
    // @ts-ignore, false positive //*
    D.ResultText = function (title, content, timestamp, style) {
        ResultItem.call(this, timestamp, style);

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

        if (content.innerText.length > 200) {
            this.bodyElm.innerHTML += "...";
        }

        this.args = [].slice.call(arguments);

        this.elm.classList.add("text");
    };

    D.ResultText.prototype = Object.create(ResultItem.prototype);
    D.ResultText.prototype.constructor = D.ResultText;

    D.ResultText.prototype.createExpandItem = function () {
        var arglist = this.args.slice();

        arglist.unshift(D.Text);
        // @ts-ignore, false positive //*
        this.expandItem = new (D.Text.bind.apply(D.Text, arglist))();
    };


    /**
     * @class
     * @extends ResultItem
     * @param {String} title title of card
     * @param {String} link link of card
     * @param {Object} content content of card
     * @param {Boolean} shouldFormatDescription if description should be formatted for ${{}}
     * @param {Number} timestamp time card was posted
     * @param {String[]} tags tags of card
     * @param {String} author author of the content showed in card
     * @param {Number} no card number
     * @param {String} style cssString of style applied to card
     */
    // @ts-ignore, false positive //*
    D.ResultCard = function (title, link, content, shouldFormatDescription, timestamp, tags, author, no, style) {
        ResultItem.call(this, timestamp, style);

        // structure
        {
            this.leftCol = document.createElement("div");
            this.leftCol.classList.add("left");
            this.leftCol.classList.add("col");
            this.elm.appendChild(this.leftCol);

            {
                this.imgElm = document.createElement("div");
                this.imgElm.classList.add("img");
                this.leftCol.appendChild(this.imgElm);
            }
        } {
            this.rightCol = document.createElement("div");
            this.rightCol.classList.add("right");
            this.rightCol.classList.add("col");
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
    };

    D.ResultCard.prototype = Object.create(ResultItem.prototype);
    D.ResultCard.prototype.constructor = D.ResultCard;

    D.ResultCard.prototype.createExpandItem = function () {
        var arglist = this.args.slice();

        arglist.unshift(D.Card);
        // @ts-ignore, false positive //*
        this.expandItem = new (D.Card.bind.apply(D.Card, arglist))();
    };

    /**
     * @class
     * @param {String} msg message
     */
    D.ErrorCard = function (msg) {
        this.elm = document.createElement("div"); {
            this.titleElm = document.createElement("div");
            this.titleElm.classList.add("title");
            this.elm.appendChild(this.titleElm);
        } {
            this.bodyElm = document.createElement("div");
            this.bodyElm.classList.add("body");
            this.elm.appendChild(this.bodyElm);
        }
        this.elm.classList.add("item");
        this.elm.classList.add("error");
        this._parent = null;

        this.title = "Error parsing this card.";
        this.content = msg;

    };

    Object.defineProperties(D.ErrorCard.prototype, {
        content: {
            get: function () {
                return this.bodyElm.innerHTML;
            },

            set: function (e) {
                this.bodyElm.innerHTML = e;
            }
        },
        title: {
            get: function () {
                return this.titleElm.innerHTML;
            },

            set: function (e) {
                if (e) {
                    this.titleElm.innerHTML = e;
                } else {
                    this.titleElm.classList.add("nonexistent");
                    this.titleElm.innerHTML = "";
                }
            }
        },
        parent: {
            get: function () {
                return this._parent;
            },

            set: function (e) {
                this.appendTo(e);
            }
        }
    });

    /**
     * Apppend to parent
     * @param {Node} parent parent to append to
     */
    D.ErrorCard.prototype.appendTo = function (parent) {
        this._parent = parent;
        parent.appendChild(this.elm);
    };

    // parsing
    // -----------------------------------------------------------------------------
    D.parseDisplayContent = function (dt, imgs) {
        var r;
        switch (dt.type) {
        case "img": {
            r = document.createElement("img");
            r.dataset.src = parseURIPath(dt.src);
            r.title = dt.caption;
            imgs.push(r);
            return r;
        }
        case "iframe":
            return D.parseDisplayContent(dt.alt, imgs);
        default: {
            r = document.createElement("div");
            r.innerHTML = "Error! <br><b>Reason:</b> Item is of unknown type";
            return r;
        }
        }
    };

    D.parseCardContent = function (dt, that, shouldFormatDescription) {
        {
            var description = document.createElement("div"); // create element
            description.appendChild(D.parseDescriptionContent(dt.description, shouldFormatDescription)); // set element content
            that.bodyElm.appendChild(description); // push to body
        } {
            var display = document.createElement("div"),
                dl = dt.display.length;

            for (var i = 0; i < dl; i++) { // for every item in display
                var item = dt.display[i];
                display.appendChild(D.parseDisplayContent(item, that.imgs));
            }
            that.displayElm.appendChild(display);
        }
    };

    D.parseCardMeta = function (dtTimestamp, dtTags, dtAuthor, dtNo, that) {
        that.titleElm.setAttribute("no", dtNo); // set number attribute to title

        {
            var tags = document.createElement("div"); // create element
            tags.innerHTML = dtTags.join(", "); // set content to tags
            tags.title = "You can search these terms";
            tags.classList.add("tags");
            that.metaElm.appendChild(tags);
        } {
            var author = document.createElement("div");
            author.innerHTML = dtAuthor.join(", ");
            author.title = "These are the people that created this\n(It's only me ik)";
            author.classList.add("author");
            that.metaElm.appendChild(author);
        } {
            var timestamp = document.createElement("div");
            timestamp.innerHTML = new Date(dtTimestamp).toLocaleDateString();
            timestamp.title = "Time this was posted.\nAutomatically adjusted to locale timezone.\n\nMilliseconds since Jan 1, 1970 12:00AM/0:00 (UTC +0): \n" + dtTimestamp.toString();
            timestamp.classList.add("timestamp");
            that.metaElm.appendChild(timestamp);
        }
    };

    /**
     * parse text
     * @param {Object} dt data
     * @returns {D.Text} Text element parsed
     */
    D.parseText = function (dt) {
        // @ts-ignore
        return new D.Text(
            dt.title,
            // @ts-ignore, false positive //*
            D.parseDescriptionContent(dt.content, dt.jsformat), // format string for ${{js}}, if required
            dt.timestamp,
            dt.style
        );
    };
    D.parseCard = function (dt) {
        return new D.Card(
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
        // @ts-ignore
        return new D.ResultText(
            dt.title,
            // @ts-ignore
            D.parseDescriptionContent(dt.content, dt.jsformat), // format string for ${{js}}, if required
            dt.timestamp,
            dt.style
        );
    };
    D.parseResultCard = function (dt) {
        return new D.ResultCard(
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
            return D.parseResultText(dt);
        case "card":
            return D.parseResultCard(dt);
        default:
            return new D.ErrorCard("Reason: Card is of unknown type");
        }
    };

    /**
     * Parse description
     * @param {String} content string to parse
     * @param {Boolean} formatjs use formatjs
     * @returns {HTMLDivElement} result content
     */
    D.parseDescriptionContent = function (content, formatjs) {
        var formatted = document.createElement("div");

        // ${{ js }}
        // --------------------------------------------------------------------------------
        if (formatjs) { // if requires formatting
            var regex = /\${{(.+?)}}/g, // matches ${{ anything }}
                // @ts-ignore
                matches = [], // list of all matches
                formattedTo = 0, // index of how far the string has formatted to
                formattedStr = ""; // formatted string to return

            // eslint-disable-next-line no-constant-condition
            while (true) { // push match to matches until there're no more matches
                var match = regex.exec(content);

                if (match) { // format on the way
                    var result = eval("(function() {" + match[1] + "}());"); // evaluated result

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
            var links = formatted.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                var link = links[i];

                link.rel = "noopener";
                link.target = "_blank";
            }
        }

        return formatted;
    };

    // Other site objects
    // -----------------------------------------------------------------------------
    D.separator = function () {
        return document.createElement("hr");
    };

    D.searchButton = function () {
        var e = document.createElement("div");

        e.classList.add("searchItem");

        // build DOM tree
        var a, b, c;
        {
            a = document.createElement("div");
            a.classList.add("searchButton");

            {
                b = document.createElement("div"); // create search text
                b.innerHTML = "Search";
                b.classList.add("text");

                a.appendChild(b);
            } {
                b = document.createElement("div"); // create icon
                b.classList.add("img");

                {
                    c = document.createElement("img");
                    c.src = "img/searchIcon.png";
                    c.alt = "search icon";
                    b.appendChild(c);
                }

                a.appendChild(b);
            }

            e.appendChild(a);
        }

        // because this is a special object
        DT.Search.initSearchButton(e);

        return e;
    };

    D.yearList = function () {
        var group = document.createElement("group"),
            first = 0,
            last = 0;

        function onLoad() {
            var event = document.createEvent("Event");

            for (var i = last; i >= first; i--) {
                var a = document.createElement("div"),
                    istr = i.toString();
                // a.dataIndex = i; //* disabled, not used yet
                a.innerHTML = istr;
                group.appendChild(a);
            }

            // can't just do new Event because IE
            event.initEvent("load", false, true);
            group.dispatchEvent(event);
        }

        function _checkLoad() {
            if (first && last) {
                onLoad();
            }
        }

        function onGetFirst(e) {
            first = e.meta.range;
            _checkLoad();
        }
        function onGetLast(e) {
            last = e.meta.range;
            _checkLoad();
        }

        DT.ContentGetter.siteContent.addEventListener("index", function () {
            DT.ContentGetter.siteContent.lastReq.addEventListener("load", onGetLast);
            DT.ContentGetter.siteContent.firstReq.addEventListener("load", onGetFirst);
        });

        return group;
    };

    return D;
}

function SiteObjects(DT) {
    var D = {};
    DT.SiteObjects = D;

    // D.path = "http://localhost:8081"; //* set to location.origin when in production
    D.path = "https://japnaa.github.io";

    class Item { // abstract item
        constructor(title, timestamp, style) {
            this.elmP = document.createElement("a");
            this.elm = document.createElement("div");

            this.elmP.target = "_blank";

            {
                this.titleElm = document.createElement("div");
                this.titleElm.classList.add("title");
                this.elm.appendChild(this.titleElm);
            } {
                this.bodyElm = document.createElement("div");
                this.bodyElm.classList.add("body");
                this.elm.appendChild(this.bodyElm);
            }

            this.added = false;

            this.imgs = [];

            this.title = title;
            this.elmP.style = style;
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
                this.titleElm.classList.add("nonexistant");
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

        appendTo(parent) {
            parent.appendChild(this.elmP);
        }

        prepAdd() {
            if (this.added) return;
            for (let i of this.imgs) {
                i.aload();
            }
            this.added = true;
        }
    }

    D.Card = class extends Item {
        constructor(title, link, content, timestamp, tags, author, no, style) {
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

            this.elmP.classList.add("item", "card");
            this.link = link;
            D.parseCardMeta(timestamp, tags, author, no, this);
            D.parseCardContent(content, this);
        }
    };

    D.Text = class extends Item {
        constructor(title, content, timestamp, style) {
            super(title, timestamp, style);

            this.elmP.classList.add("item", "text");
            this.content = content;
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
                this.titleElm.classList.add("nonexistant");
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

    D.separator = function () {
        return document.createElement("hr");
    };
    D.searchButton = function () {
        var e = document.createElement("div"),
            active = false, // state: button is active
            aniframe = 0,
            anitime = 150,
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
                    b.appendChild(c);
                }

                a.appendChild(b);
            }

            e.appendChild(a);
        }
        
        e.addEventListener("click", function () {
            active ^= true;

            if (oPos === null) {
                oPos = e.getBoundingClientRect().y - paddTop;
            }

            if (active) {
                DT.Site.menu.classList.add("searching");
                DT.Search.listenToKeystrokes(true);
            } else {
                DT.Site.menu.classList.remove("searching");
                DT.Search.listenToKeystrokes(false);
            }
            startAni();
        });

        return e;
    };
    D.yearList = function () {
        var e = document.createDocumentFragment();

        for (let i = 2016; i <= 2018; i++) { //* make this set the variables automatically
            let a = document.createElement("div");
            a.innerHTML = i;
            e.appendChild(a);
        }

        return e;
    };

    Image.prototype.aload = function () {
        if (this.src) return false;
        this.src = this.asrc;
        this.classList.add("load");
        return true;
    };

    D.parseDisplayContent = function (dt, imgs) {
        switch (dt.type) {
        case "img": {
            let r = document.createElement("img");
            r.asrc = D.path + dt.src;
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

    D.parseCardContent = function (dt, that) {
        {
            let description = document.createElement("div"); // create element
            description.innerHTML = dt.description; // set element content
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
        that.titleElm.setAttribute("no", dtNo); // set number attibute to title

        {
            let tags = document.createElement("div"); // create element
            tags.innerHTML = dtTags.join(", "); // set content to tags
            tags.classList.add("tags");
            that.metaElm.appendChild(tags);
        } {
            let author = document.createElement("div");
            author.innerHTML = dtAuthor.join(", ");
            author.classList.add("author");
            that.metaElm.appendChild(author);
        } {
            let timestamp = document.createElement("div");
            timestamp.innerHTML = new Date(dtTimestamp).toLocaleDateString();
            timestamp.classList.add("timestamp");
            that.metaElm.appendChild(timestamp);
        }
    };

    D.parseText = function (dt) {
        return new D.Text(dt.title, dt.content, dt.timestamp, dt.style);
    };
    D.parseCard = function (dt) {
        return new D.Card(dt.name, D.path + dt.content.link, dt.content, dt.timestamp, dt.tags, dt.author, dt.no, dt.style);
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
}

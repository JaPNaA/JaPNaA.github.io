function SiteObjects(DT) {
    var D = {};
    DT.SiteObjects = D;

    D.Card = class {
        constructor(title, content, timestamp, tags, author, style) {
            this.elm = document.createElement("div"); {
                this.titleElm = document.createElement("div");
                this.titleElm.classList.add("title");
                this.elm.appendChild(this.titleElm);
            } {
                this.bodyElm = document.createElement("div");
                this.bodyElm.classList.add("body");
                this.elm.appendChild(this.bodyElm);
            }
            this.elm.classList.add("item", "card");
            this._parent = null;

            this.title = title;
            this.content = D.parseCardContent(content);
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

    D.Text = class {
        constructor(title, content, timestamp, style) {
            this.elm = document.createElement("div"); {
                this.titleElm = document.createElement("div");
                this.titleElm.classList.add("title");
                this.elm.appendChild(this.titleElm);
            } {
                this.bodyElm = document.createElement("div");
                this.bodyElm.classList.add("body");
                this.elm.appendChild(this.bodyElm);
            }
            this.elm.classList.add("item", "text");
            this._parent = null;

            this.title = title;
            this.content = content;
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
        var e = document.createElement("div"); {
            let a = document.createElement("div");
            a.classList.add("searchButton");

            {
                let b = document.createElement("div");
                b.innerHTML = "Search";
                b.classList.add("text");

                a.appendChild(b);
            } {
                let b = document.createElement("div");
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

        return e;
    };
    D.yearList = function () {
        var e = document.createDocumentFragment();
        
        for (let i = 2016; i <= 2018; i++) {
            let a = document.createElement("div");
            a.innerHTML = i;
            e.appendChild(a);
        }

        return e;
    };

    D.parseCardContent = function (dt) {
        return JSON.stringify(dt);
    };

    D.parseText = function (dt) {
        return new D.Text(dt.title, dt.content, dt.timestamp, dt.style);
    };
    D.parseCard = function (dt) {
        return new D.Card(dt.name, dt.content, dt.timestamp, dt.tags, dt.author, dt.style);
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
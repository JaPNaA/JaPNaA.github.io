function SiteObjects(DT) {
    var D = {};
    DT.SiteObjects = D;

    D.Text = class {
        constructor(content) {
            this.elm = document.createElement("div");
            this.elm.classList.add("item", "text");
            this._parent = null;
            this.content = content;
        }

        get content() {
            return this.elm.innerHTML;
        }
        set content(e) {
            this.elm.innerHTML = e;
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
}
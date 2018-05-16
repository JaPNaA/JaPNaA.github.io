function Search(DT) {
    var D = {
            button: null,
            content: null,
            searchConfig: {
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
            }
        },
        listening = false;
    DT.Search = D;

    function translateIndex(id, dt) {
        switch(dt.type) {
        case "card":
            return {
                id: id,
                title: dt.name,
                body: dt.content.description,
                author: dt.author.join(" "),
                tags: dt.tags.join(" "),
                no: dt.no,
                caption: dt.content.caption
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

    function keydownHandler(e) {
        console.log(e.key);
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

    D.listenToKeystrokes = function(e) {
        if (e) {
            if (listening) return;
            listening = true;
            addEventListener("keydown", keydownHandler);
        } else {
            listening = false;
            removeEventListener("keydown", keydownHandler);
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
    };
}
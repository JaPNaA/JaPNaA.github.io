function Site(DT) {
    var D = {
            bodyFragCount: null,
            body: null,
            maxItemWidth: 524,
            minItemWidth: 480,
            menuWidth: 256,
            itemPop: false,
            children: [],
            bodyFrag: []
        },
        docFrag = document.createDocumentFragment();
    DT.Site = D;

    function createMenu() {
        var menu = document.createElement("div");
        menu.id = "menu";

        return menu;
    }

    function createHead() {
        var head = document.createElement("div");
        head.id = "head";

        {
            let title = document.createElement("div");
            title.id = "titleText";
            title.innerHTML = "JaPNaA";
            head.appendChild(title);
        }

        return head;
    }

    function createBody() {
        var body = document.createElement("div");
        D.body = body;
        body.id = "body";

        // place holder
        for (let i = 0; i < 25; i++) {
            let item = new DT.SiteObjects.Text("JaPNaA. This is the content. ".repeat(Math.round(Math.random() * 10 + 1) ** 2));
            D.children.push(item);
        }

        buildBodyFrags();

        return body;
    }

    function buildBodyFrags() {
        var e = Math.floor((innerWidth - D.menuWidth) / D.maxItemWidth);

        if (D.bodyFragCount == e) return;
        if (e == 0) e = 1;

        var bodyFragCount,
            bodyFrag = [],
            body = D.body;

        // clear
        D.bodyFragCount = e;
        bodyFragCount = e;
        for (let i of D.bodyFrag) {
            body.removeChild(i);
        }
        D.bodyFrag.length = 0;

        // set css
        DT.Utils.setCssRule(".bodyFrag", "width", (100 / bodyFragCount) + "%");
        DT.Utils.reloadCss();

        // build
        for (let i = 0; i < bodyFragCount; i++) {
            let frag = document.createElement("div");
            frag.classList.add("bodyFrag");

            document.body.appendChild(frag);
            bodyFrag.push(frag);
        }

        for (let item of D.children) {
            let smallest = bodyFrag[0],
                parent = document.createElement("div");

            parent.classList.add("itemP");
            item.appendTo(parent);

            for (let i = 1; i < bodyFragCount; i++) {
                let cfrag = bodyFrag[i];
                if (cfrag.clientHeight < smallest.clientHeight) {
                    smallest = cfrag;
                }
            }

            smallest.appendChild(parent);
        }

        D.bodyFrag = bodyFrag;
        for (let i of bodyFrag) {
            body.appendChild(i);
        }
    }

    function makeDocFrag() {
        var main = document.createElement("div");
        D.main = main;

        {
            let menu = document.createElement("div");
            menu.appendChild(createMenu());
            main.appendChild(menu);
        } {
            let content = document.createElement("div");

            {
                let body = document.createElement("div");
                body.id = "bodyP";
                body.appendChild(createBody());
                content.appendChild(body);
            } {
                let head = document.createElement("div");
                head.id = "headP";
                head.appendChild(createHead());
                content.appendChild(head);
            }

            main.appendChild(content);
        }

        docFrag.appendChild(main);
    }

    function resize() {
        buildBodyFrags();
    }

    function mousemove() {
        if (!D.itemPop) {
            D.itemPop = true;
            body.classList.add('itemPop');
        }
    }

    D.setup = function () {
        makeDocFrag();

        addEventListener("resize", resize);
        addEventListener("mousemove", mousemove);
        requestAnimationFrame(DT.SplashScreen.closeSplashScreen);

        document.body.appendChild(docFrag);
    };
}
function Site(DT) {
    var D = {
            bodyFragCount: null,
            body: null,
            menu: null,
            maxItemWidth: 624,
            minItemWidth: 480,
            menuWidth: 224,
            collapsedMenuWidth: 48,
            lastMenuCollapsed: false,
            itemPop: false,
            allowedDeviation: 64,
            scrollHeight: 0,
            children: [],
            lastAddedChildrenIx: 0,
            bodyFrag: []
        },
        docFrag = document.createDocumentFragment();
    DT.Site = D;

    function createMenu() {
        var menu = document.createElement("div");
        D.menu = menu;
        menu.id = "menu";

        {
            let a = document.createElement("div");
            a.innerHTML = "About";
            menu.appendChild(a);
        } {
            let s = DT.SiteObjects.separator();
            menu.appendChild(s);
        } {
            let a = DT.SiteObjects.searchButton();
            menu.appendChild(a);
        } {
            let s = DT.SiteObjects.separator();
            menu.appendChild(s);
        } {
            let a = DT.SiteObjects.yearList();
            menu.appendChild(a);
        }

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
        // for (let i = 0; i < 25; i++) {
        //     let item = new DT.SiteObjects.Text("Look at my very nice title " + i, "JaPNaA. This is the content. ".repeat(Math.round(Math.random() * 10 + 1) ** 2));
        //     D.children.push(item);
        // }

        DT.ContentGetter.add("content", "content/0.json", true, function (e) {
            var d = JSON.parse(e).data;
            for (let i of d) {
                let item = DT.SiteObjects.parse(i);
                if (!item) continue;
                D.children.push(item);
            }
            buildBodyFrags();
        });

        // buildBodyFrags();

        return body;
    }

    function buildBodyFrags() {
        var menuCollapsed = innerWidth - D.menuWidth < D.minItemWidth,
            e;

        if (menuCollapsed) {
            D.menu.classList.add("collapse");
            e = Math.floor((innerWidth - D.collapsedMenuWidth) / D.maxItemWidth);
        } else {
            D.menu.classList.remove("collapse");
            e = Math.floor((innerWidth - D.menuWidth) / D.maxItemWidth);
        }

        if (D.lastMenuCollapsed != menuCollapsed) {
            let a, b;
            if (menuCollapsed) {
                a = D.collapsedMenuWidth + "px";
                b = "calc(100% - " + D.collapsedMenuWidth + "px)";
            } else {
                a = D.menuWidth + "px";
                b = "calc(100% - " + D.menuWidth + "px)";
            }

            DT.Utils.setCssRule("#body", "left", a);
            DT.Utils.setCssRule("#body", "width", b);
            DT.Utils.setCssRule("#head", "left", a);
            DT.Utils.setCssRule("#head", "width", b);
            DT.Utils.reloadCss();

            D.lastMenuCollapsed = menuCollapsed;
        }

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

        D.bodyFrag = bodyFrag;

        // set css
        DT.Utils.setCssRule(".bodyFrag", "width", (100 / bodyFragCount) + "%");
        if (bodyFragCount == 1) {
            DT.Utils.setCssRule(".itemP", "max-width", null);
        } else {
            DT.Utils.setCssRule(".itemP", "max-width", "none");
        }
        DT.Utils.reloadCss();

        // build
        for (let i = 0; i < bodyFragCount; i++) {
            let frag = document.createElement("div");
            frag.classList.add("bodyFrag");

            document.body.appendChild(frag);
            bodyFrag.push(frag);
        }

        for (let item of D.children) {
            if (item.added) {
                D.addItem(item);
            }
        }

        for (let i of bodyFrag) {
            body.appendChild(i);
        }

        // load visible
        while (true) {
            if (!scroll()) {
                break;
            }
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

    // lazy loading
    function scroll() {
        var ih = innerHeight,
            imgs = document.querySelectorAll(".display img:not(.load)"),
            childrenl = D.children.length,
            hm = false;

        if (
            D.body.scrollTop + D.body.clientHeight >= 
            D.body.scrollHeight - D.children[D.lastAddedChildrenIx].elmP.clientHeight
        ) {
            for (let i = 0; i < childrenl; i++) {
                let j = D.children[i];
                if (!j.added) {
                    j.prepAdd();
                    D.addItem(j);
                    D.lastAddedChildrenIx = i;
                    hm = true;
                    break;
                }
            }
        }
        return hm;
    }

    D.addItem = function (item) {
        let smallest = D.bodyFrag[0],
            sch = smallest.clientHeight,
            parent = document.createElement("div");

        parent.classList.add("itemP");
        item.appendTo(parent);

        for (let i = 1; i < D.bodyFrag.length; i++) {
            let cfrag = D.bodyFrag[i];
            if (cfrag.clientHeight < sch - D.allowedDeviation) {
                smallest = cfrag;
                sch = cfrag.clientHeight;
            }
        }

        D.scrollHeight = sch;
        smallest.appendChild(parent);
    };

    D.setup = function () {
        makeDocFrag();

        addEventListener("resize", resize);
        addEventListener("mousemove", mousemove);
        D.body.addEventListener("scroll", scroll, {
            passive: true
        });

        requestAnimationFrame(DT.SplashScreen.closeSplashScreen);

        document.body.appendChild(docFrag);
    };
}
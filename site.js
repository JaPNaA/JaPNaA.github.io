function Site(DT) {
    var D = {
            bodyFragCount: null, // amount of columns
            bodyP: null, // body element parent
            body: null, // element
            searchOverlay: null, // element over body that contains results for search
            menu: null,
            head: null,
            headHint: null,
            headHintD: {
                ttl: {}
            },
            showingHeadHint: false,
            title: null,
            titleText: "JaPNaA", // text in the title
            notificationList: null,
            maxItemWidth: 624, // max width for items in body element
            minItemWidth: 480, // min ...
            menuWidth: 224, // width of menu
            collapsedMenuWidth: 48, // width of menu when collapsed
            lastMenuCollapsed: false, // if the menu was collapsed
            itemPop: false, // if the item 'pops' on mouse hover
            allowedDeviation: 64, // how far an item can be in the wrong column if it follows left to right
            scrollHeight: 0, // body element's height
            children: [], // items in the body
            lastAddedChildrenIx: 0, // index of the last item that was lazy-added
            bodyFrag: [], // all column elements
            path: location.origin, // path of images and links //* set to location.origin when in production
            search: DT.Utils.parseSearch(location.search) // parsed object of location.search
        },
        docFrag = document.createDocumentFragment();
    DT.Site = D;

    function createMenu() {
        var menu = DT.Menu.menu;
        D.menu = DT.Menu.menu;
        return menu;
    }

    function createHead() {
        var frag = document.createDocumentFragment(),
            head = document.createElement("div");

        D.head = head;
        head.id = "head";
        head.classList.add("noselect");
        frag.appendChild(head);

        {
            let title = document.createElement("a");
            title.href = location.origin;
            title.id = "titleText";
            title.innerHTML = D.titleText;
            D.title = title;
            head.appendChild(title);
        } {
            let headHint = document.createElement("div");
            headHint.id = "headHint";
            D.headHint = headHint;
            frag.appendChild(headHint);
        }

        return frag;
    }

    function createBody() {
        var body = document.createElement("div");
        D.body = body;
        body.id = "body";

        DT.ContentGetter.add("content", "content/0.json", true, function (e) {
            var d = e.data;
            for (let i of d) {
                let item = DT.SiteObjects.parse(i);
                if (!item) continue;
                D.children.push(item);
            }
            buildBodyFrags();
        }, "json");

        return body;
    }

    function createSearchOverlay() {
        var overlay = document.createElement("div");
        overlay.classList.add("bodyFrag");
        overlay.id = "searchOverlay";
        D.searchOverlay = overlay;

        return overlay;
    }

    function createNotificationList() {
        var notList = document.createElement("div");
        notList.id = "notificationList";
        D.notificationList = notList;

        return notList;
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

        if (D.lastMenuCollapsed !== menuCollapsed) {
            let a, b;
            if (menuCollapsed) {
                a = D.collapsedMenuWidth + "px";
                b = "calc(100% - " + D.collapsedMenuWidth + "px)";
            } else {
                a = D.menuWidth + "px";
                b = "calc(100% - " + D.menuWidth + "px)";
            }

            DT.Utils.setCssRule(":root", "--r-left", a);
            DT.Utils.setCssRule(":root", "--r-width", b);
            DT.Utils.reloadCss();

            D.lastMenuCollapsed = menuCollapsed;
        }

        if (D.bodyFragCount === e) return;
        if (e === 0) e = 1;

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
        DT.Utils.setCssRule("#body .bodyFrag", "width", 100 / bodyFragCount + "%");
        if (bodyFragCount === 1) {
            DT.Utils.setCssRule("#body .itemP", "max-width", null);
        } else {
            DT.Utils.setCssRule("#body .itemP", "max-width", "none");
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
        while (scroll());
    }

    function makeDocFrag() {
        var main = document.createElement("div");
        main.id = "main";
        D.main = main;

        {
            let menu = document.createElement("div");
            DT.Menu.menuP = menu;
            menu.id = "menuP";
            menu.appendChild(createMenu());
            main.appendChild(menu);
        } {
            let content = document.createElement("div");

            {
                let body = document.createElement("div");
                D.bodyP = body;
                body.id = "bodyP";
                body.appendChild(createBody());
                body.appendChild(createSearchOverlay()); // overlays the body
                content.appendChild(body);
            } {
                let head = document.createElement("div");
                head.id = "headP";
                head.appendChild(createHead());
                content.appendChild(head);
            }

            main.appendChild(content);
        } {
            let notificationList = document.createElement("div");
            notificationList.appendChild(createNotificationList());
            main.appendChild(notificationList);
        }

        docFrag.appendChild(main);
    }

    function resize() {
        buildBodyFrags();
    }

    function mousemove() {
        if (!D.itemPop) {
            D.itemPop = true;
            D.bodyP.classList.add("itemPop");
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

    function wheel(e) {
        if (!e.shiftKey) return;

        D.body.scrollBy(0, Math.sign(e.deltaY) * 4);
    }

    D.addItem = function (item) {
        let smallest = D.bodyFrag[0],
            sch = smallest.clientHeight;

        for (let i = 1; i < D.bodyFrag.length; i++) {
            let cfrag = D.bodyFrag[i];
            if (cfrag.clientHeight < sch - D.allowedDeviation) {
                smallest = cfrag;
                sch = cfrag.clientHeight;
            }
        }

        D.scrollHeight = sch;
        item.appendTo(smallest);
    };

    D.writeHeadHint = function (id, text, ttl) {
        for (let i in D.headHintD.ttl) {
            let j = D.headHintD.ttl[i];
            if (j !== null) {
                clearTimeout(D.headHintD.ttl[i]);
                D.headHintD.ttl[i] = null;
            }
        }
        if (ttl) {
            D.headHintD.ttl[id] =
                setTimeout(function () {
                    D.clearHeadHint();
                }, ttl);;
        }

        D.headHint.classList.add("show");
        D.showingHeadHint = true;
        DT.Utils.emptyElement(D.headHint);
        D.headHint.innerHTML = text;
    };

    D.clearHeadHint = function () {
        for (let i in D.headHintD.ttl) {
            let j = D.headHintD.ttl[i];
            if (j !== null) {
                clearTimeout(D.headHintD.ttl[i]);
                D.headHintD.ttl[i] = null;
            }
        }

        if (D.showingHeadHint) {
            D.headHint.classList.remove("show");
            D.showingHeadHint = false;
        }
    };

    D.setup = function () {
        makeDocFrag();

        addEventListener("resize", resize);
        addEventListener("mousemove", mousemove); // check for mouse
        addEventListener("wheel", wheel, {
            passive: true
        }); // hold shift to slow scroll
        D.body.addEventListener("scroll", scroll, {
            passive: true
        });

        addEventListener("load", function() {
            DT.SplashScreen.closeSplashScreen();
        }, {
            once: true
        });

        if (!navigator.onLine) {
            DT.Utils.prompta("You're offline", 1, 5000, false);
        }

        document.body.appendChild(docFrag);
    };
}
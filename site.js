function Site(DT) {
    var D = {
            bodyFragCount: null, // amount of columns
            bodyP: null, // body element parent
            body: null, // element
            searchOverlay: null, // element over body that contains results for search
            menu: null, // element
            menuItems: { // items in menu element
                about: null,
                search: null, 
                yearList: null
            },
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
            titleText: "JaPNaA", // text in the title
            path: "http://localhost:8081" // path of images and links //* set to location.origin when in production
        },
        docFrag = document.createDocumentFragment();
    DT.Site = D;

    function createMenu() {
        var menu = document.createElement("div");
        D.menu = menu;
        menu.id = "menu";
        menu.classList.add("noselect");

        {
            let a = document.createElement("div");
            a.innerHTML = "•••"; // include: send feedback, contact me, view all projects, changelog, copyright
            D.menuItems.about = a;
            menu.appendChild(a);
        } {
            let s = DT.SiteObjects.separator();
            menu.appendChild(s);
        } {
            let a = document.createElement("div");
            a.innerHTML = "About";
            D.menuItems.about = a;
            menu.appendChild(a);
        } {
            let s = DT.SiteObjects.separator();
            menu.appendChild(s);
        } {
            let a = DT.SiteObjects.searchButton();
            D.menuItems.search = a;
            menu.appendChild(a);
        } {
            let s = DT.SiteObjects.separator();
            menu.appendChild(s);
        } {
            let a = DT.SiteObjects.yearList();
            D.menuItems.yearList = a;
            menu.appendChild(a);
        }

        return menu;
    }

    function createHead() {
        var head = document.createElement("div");
        D.head = head;
        head.id = "head";
        head.classList.add("noselect");        

        {
            let title = document.createElement("a");
            title.href = D.path;
            title.id = "titleText";
            title.innerHTML = D.titleText;
            D.title = title;
            head.appendChild(title);
        }

        return head;
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

            DT.Utils.setCssRule("#body", "left", a);
            DT.Utils.setCssRule("#body", "width", b);
            DT.Utils.setCssRule("#head", "left", a);
            DT.Utils.setCssRule("#head", "width", b);
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

        document.body.appendChild(docFrag);
    };
}
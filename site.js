function c_Site(DT) {
    var D = {
        // elements
        // --------------------------------------------------------------------------------
        main: null,                 // where everything goes
        body: null,                 // element where the main content goes
        bodyP: null,                // body element's parent element

        menu: null,                 // element on the left for navigation

        head: null,                 // element on the top of the page saying that it's my website
        title: null,                // element in the head containing the title of the page
        headHint: null,             // element below the head containing information

        searchOverlay: null,        // element over body that contains results for search
        aboutPage: null,            // element over body that contains the about page
        notificationList: null,     // element containing notifications

        children: [],               // items in the body
        bodyFrag: [],               // all column elements

        // constants
        // --------------------------------------------------------------------------------
        titleText: "JaPNaA",        // text in the title

        maxItemWidth: 624,          // MAX width for items in body element
        minItemWidth: 480,          // MIN width for items in body element

        menuWidth: 224,             // width of menu
        collapsedMenuWidth: 48,     // width of menu when collapsed

        allowedDeviation: 32,       // how far an item can be in the wrong column if it follows left to right
        scrollBuffer: 640,          // how far to load elements in the body

        path: location.origin === "http://localhost:8080" ? "http://localhost:8081" : location.origin, // path of images and links (automatically changes)

        // states
        // --------------------------------------------------------------------------------
        lastMenuCollapsed: false,   // if the menu was collapsed
        isDesktop: false,           // if the item 'pops' on mouse hover
        showingHeadHint: false,

        bodyFragCount: null,        // amount of columns in body
        scrollHeight: 0,            // body element's height
        lastAddedChildrenIx: 0,     // index of the last item that was lazy-added
        search: DT.Utils.parseSearch(location.search), // parsed object of location.search

        headHintD: {                // data for headHint
            ttl: {}                     // time to live for headhint's elements
        }

    };

    var docFrag = document.createDocumentFragment();
    DT.Site = D;

    // create functions
    // --------------------------------------------------------------------------------
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

        let req = DT.ContentGetter.add("content", "content/0.json", true, function (e) {
            var d = e.data;
            for (let i = 0; i < d.length; i++) {
                let j = d[i];

                let item = DT.SiteObjects.parse(j);
                if (!item) continue;
                item.tabindex = j;
                D.children.push(item);
            }
            buildBodyFrags();
        }, "json");
        
        req.addEventListener("error", function () { // alerts the user if the request failed
            DT.Utils.prompta("Could not load content", 2, null, true);
        });

        return body;
    }

    function createSearchOverlay() {
        var overlay = document.createElement("div");
        overlay.classList.add("bodyFrag");
        overlay.id = "searchOverlay";
        D.searchOverlay = overlay;

        return overlay;
    }

    function createAboutPage() {
        var about = document.createElement("div");
        about.classList.add("bodyFrag");
        about.id = "aboutPage";
        D.aboutPage = about;

        return about;
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
        while (D.bodyFrag.length) {
            body.removeChild(D.bodyFrag.pop());
        }

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

        for (let i = 0; i < D.children.length; i++) {
            let item = D.children[i];

            if (item.added) {
                D.addItem(item);
            }
        }

        for (let i = 0; i < bodyFrag.length; i++) {
            body.appendChild(bodyFrag[i]);
        }

        // load visible
        while (scroll());
    }

    // make functions 
    // --------------------------------------------------------------------------------

    // column of cards
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
                body.appendChild(createAboutPage()); // about page overlaying the body
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

    // event handlers
    // --------------------------------------------------------------------------------

    function resize() {
        buildBodyFrags();
    }

    function mousemove() {
        if (!D.isDesktop) {
            D.isDesktop = true;
            updateDeviceType();
        }
    }

    function touch(e) {
        if (!D.isMobile) {
            D.isMobile = true;
            updateDeviceType();
        }
    }

    // scrolling
    // --------------------------------------------------------------------------------

    // lazy loading
    function scroll() {
        var ih = innerHeight,
            imgs = document.querySelectorAll(".display img:not(.load)"),
            childrenl = D.children.length,
            hm = false;

        if (D.children.length === 0) { // if there are no children, reload, because there must be some.
            location.reload(false);
            return false;
        }

        if (
            D.body.scrollTop + D.body.clientHeight + D.scrollBuffer /* bottom of visible portion of body element, shifted down by scrollBuffer */ >=
            D.body.scrollHeight - D.children[D.lastAddedChildrenIx].elmP.clientHeight /* top of last element */
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

    // public functions
    // --------------------------------------------------------------------------------
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
                }, ttl);
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

    // misc. functions
    // --------------------------------------------------------------------------------

    function updateDeviceType() {
        if (D.isMobile) {
            D.main.classList.remove("desktop");
        } else if (D.isDesktop) {
            D.main.classList.add("desktop");
        } else {
            D.main.classList.remove("desktop");
        }
    }

    D.setup = function () {
        makeDocFrag();

        // user events
        addEventListener("mousemove", mousemove); // check for mouse
        addEventListener("wheel", wheel, {
            passive: true
        }); // hold shift to slow scroll

        // touch events
        addEventListener("touchstart", touch, {
            passive: true
        });
        addEventListener("touchend", touch, {
            passive: true
        });
        addEventListener("touchmove", touch, {
            passive: true
        });

        // behaviour events
        addEventListener("resize", resize);
        D.body.addEventListener("scroll", scroll, {
            passive: true
        });
        addEventListener("load", function() {
            DT.SplashScreen.closeSplashScreen();
        }, {
            once: true
        });

        if (!navigator.onLine) {
            DT.Utils.prompta("You're offline", 1, null, false);
        }

        document.body.appendChild(docFrag);
    };

    return D;
}
function Menu(DT) {
    const D = {
        menu: null, // element
        menuP: null,
        menuItems: { // items in menu element
            more: null,
            about: null,
            search: null,
            yearList: null
        },
    };
    DT.Menu = D;

    function createSub() {
        var sub = document.createElement("div");
        sub.classList.add("submenu");
        return sub;
    }

    D.createMoreSub = function () {
        var sub = createSub();
        D.menuP.appendChild(sub);
    };

    D.moreClicked = function () {
        if (DT.Site.lastMenuCollapsed) {
            //* expand menu

        } else {
            //* opens submenu
            D.createMoreSub();
        }
    };

    D.createMenu = function () {
        var menu = document.createElement("div");
        D.menu = menu;
        menu.id = "menu";
        menu.classList.add("noselect");

        {
            let a = document.createElement("div");
            a.innerHTML = "\u2022\u2022\u2022"; //* include: send feedback, contact me, view all projects, changelog, copyright
            D.menuItems.more = a;
            a.addEventListener("click", function () {
                D.moreClicked();
            });
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
    };

    D.setup = function () {
        D.menu = D.createMenu();
        D.menuP = DT.Site.menuP;
    };
}
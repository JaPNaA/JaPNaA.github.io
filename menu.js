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

    function createBackButton() {
        var backButton = document.createElement("div"),
            arrow = document.createElement("div"),
            back = document.createElement("div");

        arrow.classList.add("arrow");
        arrow.appendChild(document.createTextNode("<"));

        back.classList.add("back");
        back.appendChild(document.createTextNode("back"));

        backButton.classList.add("backButton");
        backButton.appendChild(arrow);
        backButton.appendChild(back);

        return backButton;
    }

    function createSub() {
        var sub = document.createElement("div"),
            backButton = createBackButton(),
            separator = DT.SiteObjects.separator();
        sub.classList.add("submenu", "noselect");

        DT.Utils.reqreqanf(function () {
            sub.classList.add("open");
        });

        backButton.addEventListener("click", function () {
            D.menu.classList.remove("sub");
            sub.classList.remove("open");

            sub.addEventListener("transitionend", function (e) {
                if (e.path[0] == this && this.parentElement) {
                    sub.parentElement.removeChild(sub);
                }
            });
        });

        sub.appendChild(backButton);
        sub.appendChild(separator);

        // and also adds .sub to menu
        D.menu.classList.add("sub");
        return sub;
    }

    D.createMoreSub = function () {
        var sub = createSub();

        //* include: send feedback, contact me, view all projects, changelog, copyright
        {
            let feedback = document.createElement("div");
            feedback.innerHTML = "Feedback";
            sub.appendChild(feedback);
        } {
            let contact = document.createElement("div");
            contact.innerHTML = "Contact me";
            sub.appendChild(contact);
        }

        sub.appendChild(DT.SiteObjects.separator());

        {
            let allProjects = document.createElement("div");
            allProjects.innerHTML = "All projects";
            sub.appendChild(allProjects);
        } {
            let changelog = document.createElement("div");
            changelog.innerHTML = "Changelog";
            sub.appendChild(changelog);
        }

        sub.appendChild(DT.SiteObjects.separator());

        {
            let copyright = document.createElement("div");
            copyright.innerHTML = "Copyright (c) 2018 JaPNaA <br> All Rights Reserved.";
            copyright.style.fontSize = "0.8rem";
            copyright.style.opacity = 0.5;
            sub.appendChild(copyright);
        }

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
            a.innerHTML = "\u2022\u2022\u2022"; 
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
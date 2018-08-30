"use strict";

function c_Menu(DT) {
    var D = {
        menu: null, // element
        menuP: null,
        expanded: true, // is the menu element is expanded
        menuItems: { // items in menu element
            more: null,
            about: null,
            search: null,
            yearList: null
        },
        moreSub: null // menu ...
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

    function initSub(sub) {
        DT.Utils.reqreqanf(function () {
            sub.classList.add("open");
        });

        D.menu.classList.add("sub");
    }

    function createSub() {
        var sub = document.createElement("div"),
            backButton = createBackButton(),
            separator = DT.SiteObjects.separator();
        sub.classList.add("submenu");
        sub.classList.add("noselect");

        initSub(sub);

        backButton.addEventListener("click", function () {
            if (!D.menu.classList.contains("sub")) return;

            D.menu.classList.remove("sub");
            sub.classList.remove("open");
        });

        sub.appendChild(backButton);
        sub.appendChild(separator);

        return sub;
    }

    D.createMoreSub = function () {
        if (D.moreSub) {
            initSub(D.moreSub);
            D.menuP.appendChild(D.moreSub);
            return;
        }

        var sub = createSub(), a;

        // includes: send feedback, contact me, view all projects, changelog, copyright
        {
            var feedback = document.createElement("div");
            {
                a = document.createElement("a");
                a.href = "https://github.com/JaPNaA/JaPNaA.github.io/issues/new";
                a.target = "_blank";
                a.innerHTML = "Feedback";
                feedback.appendChild(a);
            }
            sub.appendChild(feedback);
        } {
            var contact = document.createElement("div");
            {
                a = document.createElement("a");
                a.href = "mailto:japnaabot@gmail.com";
                a.innerHTML = "Contact";
                contact.appendChild(a);
            }
            sub.appendChild(contact);
        }

        sub.appendChild(DT.SiteObjects.separator());

        {
            var allProjects = document.createElement("div");
            {
                a = document.createElement("a");
                a.href = DT.Site.path + "/Thingy/";
                a.target = "_blank";
                a.innerHTML = "All projects";
                allProjects.appendChild(a);
            }
            sub.appendChild(allProjects);
        } {
            var changelog = document.createElement("div");
            {
                a = document.createElement("a");
                a.href = "/content/changelog.txt";
                a.target = "_blank";
                a.innerHTML = "Changelog";
                changelog.appendChild(a);
            }
            sub.appendChild(changelog);
        }

        sub.appendChild(DT.SiteObjects.separator());

        {
            var license = document.createElement("div");
            {
                a = document.createElement("a");
                a.href = "LICENSE.txt";
                a.target = "_blank";
                a.innerHTML = "License";
                license.appendChild(a);
            }
            sub.appendChild(license);
        }
        {
            var thridparty = document.createElement("div");
            {
                a = document.createElement("a");
                a.href = "/3rdParty/3rdPartyLices.txt";
                a.target = "_blank";
                a.innerHTML = "3rd Party <br> Licenses";
                thridparty.appendChild(a);
            }
            sub.appendChild(thridparty);
        }
        {
            var copyright = document.createElement("div");
            copyright.innerHTML = "Copyright (c) 2018 JaPNaA";
            copyright.title = "Not registered tho";
            copyright.style.fontSize = "0.8rem";
            copyright.style.opacity = 0.5;
            sub.appendChild(copyright);
        }

        D.moreSub = sub;
        D.menuP.appendChild(sub);
    };

    D.expand = function () {
        if (D.expanded) return;
        D.expanded = true;
        D.menu.classList.remove("collapse");
    };

    D.collapse = function () {
        if (!D.expanded || !DT.Site.menuCollapsed) return;
        D.expanded = false;
        D.menu.classList.add("collapse");
    };

    D.moreClicked = function () {
        if (D.expanded) {
            // opens submenu
            D.createMoreSub();
        } else {
            // expand menu
            D.expand();
        }
    };

    D.clickOutside = function (e) {
        if (
            D.expanded && DT.Site.menuCollapsed && // if can collapse
            !(                                         // clicked outside of menu
                D.menuP === e.target ||
                DT.Utils.isDescendant(D.menuP, e.target)
            )
        ) {
            D.collapse();
        }
    };

    D.createMenu = function () {
        var menu = document.createElement("div"), a, s;
        D.menu = menu;
        menu.id = "menu";
        menu.classList.add("noselect");

        {
            a = document.createElement("div");
            a.innerHTML = "\u2022\u2022\u2022";
            D.menuItems.more = a;
            a.addEventListener("click", function () {
                D.moreClicked();
            });
            menu.appendChild(a);
        } {
            s = DT.SiteObjects.separator();
            menu.appendChild(s);
        } {
            a = document.createElement("div");
            a.innerHTML = "About";
            a.addEventListener("click", function () {
                D.collapse();

                if (DT.c_["c_AboutPage"]) {
                    DT.AboutPage.activate();
                } else {
                    console.error("index.js didn't load c_AboutPage, user attempted to launch AboutPage");
                    DT.Utils.prompta("Failed to launch c_AboutPage. Your browser may not be supported.", 2, 0, false);
                }
            });
            D.menuItems.about = a;
            menu.appendChild(a);
        } {
            s = DT.SiteObjects.separator();
            menu.appendChild(s);
        } {
            a = DT.SiteObjects.searchButton();
            a.addEventListener("click", function () {
                D.collapse();
            });
            D.menuItems.search = a;
            menu.appendChild(a);
        } {
            s = DT.SiteObjects.separator();
            menu.appendChild(s);
        } {
            a = DT.SiteObjects.yearList();
            D.menuItems.yearList = a;

            a.addEventListener("load", function () {
                D.collapse();
                for (var i = 0; i < a.children.length; i++) {
                    a.children[i].addEventListener("click", function () {
                        DT.Utils.prompta("Error: not implemented <br> This feature has not been added yet.", 2, 5000, false);
                    });
                }
            });

            menu.appendChild(a);
        }

        return menu;
    };

    D.setup = function () {
        addEventListener("click", D.clickOutside);
        addEventListener("touchdown", D.clickOutside);

        D.menu = D.createMenu();
        D.menuP = DT.Site.menuP;
    };

    return D;
}
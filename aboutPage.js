function c_AboutPage(DT) {
    var D = {
        elm: null,
        active: false,
        loaded: false
    };
    DT.AboutPage = D;

    D.activate = function () {
        D.active = !D.active;

        if (D.active) {
            DT.Site.main.classList.add("aboutpageActive");
            DT.Menu.menuItems.about.classList.add("active");
        } else {
            DT.Site.main.classList.remove("aboutpageActive");
            DT.Menu.menuItems.about.classList.remove("active");
        }


        if (!D.loaded) {
            DT.ContentGetter.add("about", "content/about.json", true, function (e) {
                var d = e.data,
                    dl = d.length;

                DT.Utils.emptyElement(D.elm);

                for (let i = 0; i < dl; i++) {
                    let j = d[i];
                    
                    let item = DT.SiteObjects.parse(j);
                    if (!item) continue;
                    item.appendTo(D.elm);
                }

                D.loaded = true;
            }, "json");
        }
    };

    D.setup = function () {
        D.elm = DT.Site.aboutPage;
        D.elm.innerHTML = "Loading content...";
        // new DT.SiteObjects.Text("About JaPNaA", "").appendTo(D.elm);
    };
    
    return D;
}
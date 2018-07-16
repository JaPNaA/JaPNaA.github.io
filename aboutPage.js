function AboutPage(DT) {
    var D = {
        elm: null,
        active: false,
        loaded: false
    };
    DT.AboutPage = D;

    D.activate = function () {
        DT.Site.main.classList.toggle("aboutpageActive");

        if (!D.loaded) {
            DT.ContentGetter.add("about", "content/about.json", false, function (e) {
                var d = e.data;

                DT.Utils.emptyElement(D.elm);

                for (let i of d) {
                    let item = DT.SiteObjects.parse(i);
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
}
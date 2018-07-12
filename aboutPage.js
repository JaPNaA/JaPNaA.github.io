function AboutPage(DT) {
    var D = {
        elm: null,
        active: false
    };
    DT.AboutPage = D;

    D.activate = function () {
        DT.Site.main.classList.toggle("aboutpageActive");

        D.elm.innerHTML = "About page is <i> about </i> to be added! <br><br><br> just close the page already <br> close it by clicking the about button again. <br> I haven't finished the menu yet.";
    };

    D.setup = function () {
        D.elm = DT.Site.aboutPage;
    };
}
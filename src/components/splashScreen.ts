class SplashScreen {
    private elm: HTMLDivElement;

    constructor() {
        this.elm = document.createElement("div");
        this.elm.classList.add("splashScreen");

        this.elm.innerText = "Loading... (this will never load because the site is incomplete)";
    }

    public appendTo(elm: HTMLElement) {
        elm.appendChild(this.elm);
    }
}

export default SplashScreen;
import "../../styles/views/splashScreen.less";

import View from "./view";

class SplashScreen extends View {
    public viewName = "SplashScreen";
    protected elm: HTMLDivElement;

    constructor() {
        super();
        this.elm = document.createElement("div");
    }

    public setup() {
        super.setup();
        this.elm.innerText = "Loading...";
    }
}

export default SplashScreen;
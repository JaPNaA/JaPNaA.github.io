import "../../styles/scenes/splashScreen.less";

import Scene from "./scene";

class SplashScreen extends Scene {
    protected sceneName = "SplashScreen";
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
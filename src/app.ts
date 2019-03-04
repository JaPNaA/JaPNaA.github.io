import "../styles/index.less";
import SplashScreen from "./components/splashScreen";

class App {
    private mainElm: HTMLDivElement;

    constructor() {
        this.mainElm = document.createElement("div");
        this.mainElm.classList.add("main");
    }

    public async setup(): Promise<void> {
        document.body.appendChild(this.mainElm);
        this.showLoading();
        // this.loadResources();
    }

    private showLoading(): void {
        const splashScreen = new SplashScreen();
        splashScreen.appendTo(this.mainElm);
    }
}

export default App;
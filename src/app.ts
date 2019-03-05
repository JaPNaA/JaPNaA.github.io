import "../styles/index.less";

import SplashScreen from "./views/splashScreen";
import View from "./views/view";
import ViewClass from "./types/ViewClass";
import Overview from "./views/overview";
import ProjectDetailedView from "./views/projectDetailed";

class App {
    /** Main element app lives in */
    private mainElm: HTMLDivElement;
    /** All active scenes in app */
    private activeScenes: View[];

    constructor() {
        this.mainElm = document.createElement("div");
        this.mainElm.classList.add("main");

        this.activeScenes = [];
    }

    public async setup(): Promise<void> {
        document.body.appendChild(this.mainElm);

        const splashScreen = this.openView(SplashScreen);
        
        await this.loadResources();
        this.closeView(splashScreen);

        this.openView(Overview);

        // test
        // ----------------------------------------------------------------------------------------
        const proj = await fetch("./content/2018.json").then(e => e.json());
        const projectScene = new ProjectDetailedView(proj.data[0]);
        projectScene.setup();
        projectScene.appendTo(this.mainElm);
    }

    private async loadResources(): Promise<void> {
        // TODO: remove simulated wait
        await new Promise(function(res) {
            setTimeout(function() {
                res();
            }, 100);
        });
    }

    private openView(viewClass: ViewClass): View {
        const scene = new viewClass();
        scene.setup();
        scene.appendTo(this.mainElm);
        return scene;
    }

    private closeView(scene: View): void {
        scene.destory().then(() => scene.removeFrom(this.mainElm));
    }

    private switchView(scene: View) {
        //
    }
}

export default App;
import "../styles/index.less";

import SplashScreen from "./scenes/splashScreen";
import Scene from "./scenes/scene";
import SceneClass from "./types/SceneClass";
import Overview from "./scenes/overview";

class App {
    /** Main element app lives in */
    private mainElm: HTMLDivElement;
    /** All active scenes in app */
    private activeScenes: Scene[];

    constructor() {
        this.mainElm = document.createElement("div");
        this.mainElm.classList.add("main");

        this.activeScenes = [];
    }

    public async setup(): Promise<void> {
        document.body.appendChild(this.mainElm);

        const splashScreen = this.openScene(SplashScreen);
        
        await this.loadResources();
        this.closeScene(splashScreen);

        this.openScene(Overview);
    }

    private async loadResources(): Promise<void> {
        // TODO: remove simulated wait
        await new Promise(function(res) {
            setTimeout(function() {
                res();
            }, 1000);
        });
    }

    private openScene(sceneClass: SceneClass): Scene {
        const scene = new sceneClass();
        scene.setup();
        scene.appendTo(this.mainElm);
        return scene;
    }

    private closeScene(scene: Scene): void {
        scene.destory().then(() => scene.removeFrom(this.mainElm));
    }
}

export default App;
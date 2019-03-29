import "../../styles/index.less";

import SplashScreen from "../elm/views/views/splashScreen";
import View from "../elm/views/view";
import Overview from "../elm/views/views/overview";
import SiteResources from "../siteResources";
import GlobalWidget from "../elm/widgets/global/global";
import BaseApp from "./baseApp";
import EventHandlers from "../utils/events/eventHandlers";
import wait from "../utils/wait";

class App extends BaseApp {
    protected resizeHandlers: EventHandlers;
    private globalWidget: GlobalWidget;

    constructor() {
        super();
        this.resizeHandlers = new EventHandlers();
        this.globalWidget = new GlobalWidget(this);
    }

    public async setup(): Promise<void> {
        super.setup();

        this.addEventHandlers();

        this.globalWidget.setup();
        this.globalWidget.appendTo(this.mainElm);
        document.body.appendChild(this.mainElm);

        const splashScreen: View = this.views.open(SplashScreen);

        this.url.restoreIfShould();
        if (!this.url.restoredFromRedirect) {
            this.views.open(Overview);
        }

        await SiteResources.nextDone();
        this.views.close(splashScreen);
    }

    private addEventHandlers() {
        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);
    }

    private resizeHandler() {
        this.width = innerWidth;
        this.height = innerHeight;
        this.resizeHandlers.dispatch();
    }
}

export default App;
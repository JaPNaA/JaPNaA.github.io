import "../styles/index.less";

import SplashScreen from "./elm/views/views/splashScreen";
import View from "./elm/views/view";
import Overview from "./elm/views/views/overview";
import URLManager from "./components/url/urlMan";
import SiteResources from "./siteResources";
import GlobalWidget from "./elm/widgets/global/global";
import BaseApp from "./lightApp";

class App extends BaseApp {
    private globalWidget: GlobalWidget;

    constructor() {
        super();
        this.globalWidget = new GlobalWidget(this);
    }

    public async setup(): Promise<void> {
        super.setup();
        this.globalWidget.setup();
        this.globalWidget.appendTo(this.mainElm);
        document.body.appendChild(this.mainElm);

        const splashScreen: View = this.openView(SplashScreen);

        URLManager.restoreIfShould(this);
        if (!URLManager.restoredFromRedirect) {
            this.openView(Overview);
        }

        await SiteResources.nextDone();
        this.closeView(splashScreen);
    }
}

export default App;
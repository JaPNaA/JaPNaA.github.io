import "../styles/index.less";

import SplashScreen from "./elm/views/splashScreen/splashScreen";
import GlobalWidgets from "./elm/widgets/global/global";
import ContentMan from "./components/contentMan/contentMan";
import View404 from "./elm/views/404/404";
import MainApp from "./core/app/mainApp";
import SiteConfig from "./siteConfig";
import Overview from "./elm/views/overview/overview";

class App extends MainApp {
    public view404 = View404;
    public splashScreenView = SplashScreen;
    public indexView = Overview;
    public autoRestoreState = true;
    public title = SiteConfig.title;

    private globalWidget: GlobalWidgets;

    constructor() {
        super();
        this.globalWidget = new GlobalWidgets(this);
    }

    public async setup(): Promise<void> {
        await super.setup();
        this.globalWidget.setup();
        this.globalWidget.appendTo(this.mainElm);
    }
}


ContentMan.setup();

export default App;
import "../styles/index.less";

import "./elm/views/_setViewImporter";
import "./elm/widgets/_setWidgetImporter";

import SplashScreen from "./elm/views/SplashScreen/SplashScreen";
import GlobalWidgets from "./elm/widgets/Global/Global";
import ContentMan from "./components/contentMan/contentMan";
import MainApp from "./core/app/MainApp";
import siteConfig from "./SiteConfig";

class App extends MainApp {
    public view404 = "view404";
    public splashScreenView = SplashScreen;
    public indexView = "Overview";
    public autoRestoreState = true;
    public title = siteConfig.title;

    private globalWidget: GlobalWidgets;

    constructor() {
        super();
        this.globalWidget = new GlobalWidgets(this);

        if (siteConfig.isMobile) {
            this.mainElm.classList.add("mobile");
        } else {
            this.mainElm.classList.add("notMobile");
        }
    }

    public async setup(): Promise<void> {
        await super.setup();
        this.globalWidget.setup();
        this.globalWidget.appendTo(this.mainElm);
    }
}


ContentMan.setup();

export default App;
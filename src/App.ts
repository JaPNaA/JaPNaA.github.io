import "../styles/index.less";

import "./elm/views/_setViewImporter";
import "./elm/widgets/_setWidgetImporter";

import SplashScreen from "./elm/views/SplashScreen/SplashScreen";
import GlobalWidgets from "./elm/widgets/Global/Global";
import ContentMan from "./components/contentMan/contentMan";
import MainApp from "./core/app/MainApp";
import siteConfig from "./SiteConfig";
import SiteThemes from "./components/siteThemes/siteThemes";

class App extends MainApp {
    public view404 = "view404";
    public splashScreenView = SplashScreen;
    public indexView = "Overview";
    public autoRestoreState = true;
    public title = siteConfig.title;

    private globalWidget: GlobalWidgets;
    private siteThemes: SiteThemes;

    constructor() {
        super();
        this.globalWidget = new GlobalWidgets(this);
        this.siteThemes = new SiteThemes();

        if (siteConfig.isMobile) {
            this.mainElm.classList.add("mobile");
        } else {
            this.mainElm.classList.add("notMobile");
        }

        this.updateTheme();
    }

    public async setup(): Promise<void> {
        await super.setup();
        this.globalWidget.setup();
        this.globalWidget.appendTo(this.mainElm);

        this.settingsChangeHandler = this.settingsChangeHandler.bind(this);
        siteConfig.onSettingsChanged(this.settingsChangeHandler);
    }

    public async destory(): Promise<void> {
        await super.destory();
        siteConfig.offSettingsChanged(this.settingsChangeHandler);
    }

    private settingsChangeHandler(): void {
        this.updateTheme();
    }

    private updateTheme(): void {
        if (siteConfig.settings.darkMode) {
            this.siteThemes.enable(siteConfig.path.theme.dark);
        } else {
            this.siteThemes.disable();
        }
    }
}


ContentMan.setup();

export default App;
import "../styles/index.less";

import GlobalWidgets from "./elm/widgets/Global/Global";
import ContentMan from "./components/contentMan/contentMan";
import MainApp from "./core/app/MainApp";
import siteConfig from "./SiteConfig";
import SiteThemes from "./components/siteThemes/SiteThemes";
import indexRoutes from "./elm/views/routes";

class App extends MainApp {
    public view404 = "view404";
    public splashScreenView = "SplashScreen";
    // public indexView = "Overview";
    public viewError = "ErrorView";

    public autoRestoreState = true;
    public title = siteConfig.title;
    public routes = indexRoutes;

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

        if (!siteConfig.developmentMode || siteConfig.isMobile) {
            this.loadFonts();
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

    private loadFonts(): void {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css?family=Roboto:400,500,700|Share+Tech+Mono&display=swap";
        document.head.appendChild(link);
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
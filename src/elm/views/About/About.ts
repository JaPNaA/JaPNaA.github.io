import "../../../../styles/views/about.less";

import View from "../../../core/view/view";
import ViewMap from "../../../core/view/viewMap";
import IApp from "../../../core/types/app/iApp";
import HTMLView from "../../widgets/HTMLView/HTMLView";
import SiteConfig from "../../../siteConfig";

class About extends View {
    protected elm: HTMLElement;
    public static viewName = "About";
    public viewName = About.viewName;
    public isFullPage = true;

    private contentContainer: HTMLDivElement;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.contentContainer = this.createContentContainer();
        this.elm.appendChild(this.contentContainer);
    }

    public setup() {
        super.setup();
        const view = new HTMLView(this.app, SiteConfig.path.view.about);
        view.setup();
        view.appendTo(this.contentContainer);
    }

    private createContentContainer() {
        const contentContainer = document.createElement("div");
        contentContainer.classList.add("contentContainer");
        contentContainer.classList.add("longTextContainer");
        return contentContainer;
    }
}

ViewMap.add(About);

export default About;
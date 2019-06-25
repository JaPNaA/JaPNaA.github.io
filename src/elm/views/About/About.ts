import "../../../../styles/views/About.less";

import View from "../../../core/view/View";
import ViewMap from "../../../core/view/ViewMap";
import IApp from "../../../core/types/app/IApp";
import HTMLView from "../../widgets/HTMLView/HTMLView";
import SiteConfig from "../../../SiteConfig";

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
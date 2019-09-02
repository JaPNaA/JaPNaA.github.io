import "../../../../styles/views/About.less";

import View from "../../../core/view/View";
import ViewMap from "../../../core/view/ViewMap";
import IApp from "../../../core/types/app/IApp";
import HTMLView from "../../widgets/HTMLView/HTMLView";
import siteConfig from "../../../SiteConfig";
import AppState from "../../../core/types/AppState";
import SaveScroll from "../../../components/viewPrivateData/saveScroll/SaveScroll";
import ISavableScroll from "../../../components/viewPrivateData/saveScroll/ISaveScrollable";

class About extends View implements ISavableScroll {
    public static viewName = "About";
    public viewName = About.viewName;
    public isFullPage = true;
    
    public scrollingElm: HTMLElement;

    protected elm: HTMLElement;

    private contentContainer: HTMLDivElement;
    private saveScroll: SaveScroll;

    constructor(app: IApp, state: AppState) {
        super(app, state);
        this.scrollingElm = this.elm = document.createElement("div");
        this.contentContainer = this.createContentContainer();
        this.elm.appendChild(this.contentContainer);

        this.viewComponents.push(
            this.saveScroll = new SaveScroll(this, this.privateData)
        );
    }

    public setup() {
        super.setup();
        const view = new HTMLView(this.app, siteConfig.path.view.about);
        view.setup().then(() => this.saveScroll.apply());
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
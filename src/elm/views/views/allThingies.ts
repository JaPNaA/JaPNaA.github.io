import View from "../view";
import IApp from "../../../types/app/iApp";
import ViewMap from "../viewMap";
import SiteResources from "../../../siteResources";
import SiteConfig from "../../../siteConfig";

class AllThingies extends View {
    public static viewName = "AllThingies";
    public viewName = AllThingies.viewName;
    protected elm: HTMLDivElement;

    public isFullPage = true;

    constructor(app: IApp) {
        super(app)
        this.elm = document.createElement("div");
    }

    public async setup() {
        super.setup();
        const title = this.createTitle();
        this.elm.appendChild(title);

        SiteResources.loadXML(
            SiteConfig.path.thingy + SiteConfig.path.repo.thingy,
            "text/html"
        ).onLoad(e => this.elm.innerHTML += e.document.body.innerHTML);
    }

    private createTitle(): HTMLHeadingElement {
        const title = document.createElement("h1");
        title.classList.add("title");
        title.innerText = "All my thingies";
        return title;
    }
}

ViewMap.add(AllThingies);

export default AllThingies;
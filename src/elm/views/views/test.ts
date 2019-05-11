import View from "../view";
import IApp from "../../../types/app/iApp";
import ViewMap from "../viewMap";
import SiteResources from "../../../siteResources";

class TestView extends View {
    public static viewName: string = "test";
    public viewName = TestView.viewName;
    public showMenuButton = false;

    protected elm: HTMLDivElement;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.elm.id = "test";

        SiteResources.loadText("test-bundle.js")
            .onLoad(e => eval(e.text as string))
            .onError(() => this.elm.innerText = "test-bundle.js doesn't exist, cannot run tests.");
    }
}

ViewMap.add(TestView);

export default TestView;
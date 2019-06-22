import "../../../../styles/views/test.less";

import View from "../../../core/view/view";
import IApp from "../../../core/types/app/iApp";
import ViewMap from "../../../core/view/viewMap";
import SiteResources from "../../../core/siteResources";

class TestView extends View {
    public static viewName: string = "Test";
    public viewName = TestView.viewName;
    public showMenuButton = false;
    public isFullPage = true;

    protected elm: HTMLDivElement;

    constructor(app: IApp) {
        super(app);
        this.elm = document.createElement("div");
        this.elm.id = "test";

        SiteResources.loadText("test-bundle.js")
            .onLoad(e => eval(e.data as string))
            .onError(() => this.elm.innerText = "test-bundle.js doesn't exist, cannot run tests.");
    }
}

ViewMap.add(TestView);

export default TestView;
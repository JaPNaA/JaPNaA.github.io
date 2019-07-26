import "../../../../styles/views/Test.less";

import View from "../../../core/view/View";
import IApp from "../../../core/types/app/IApp";
import ViewMap from "../../../core/view/ViewMap";
import siteResources from "../../../core/siteResources";
import AppState from "../../../core/types/AppState";

class TestView extends View {
    public static viewName: string = "Test";
    public viewName = TestView.viewName;
    public showMenuButton = false;
    public isFullPage = true;

    protected elm: HTMLDivElement;

    constructor(app: IApp, state: AppState) {
        super(app, state);
        this.elm = document.createElement("div");
        this.elm.id = "test";

        siteResources.loadText("bundles/test-bundle.js")
            .onLoad(e => eval(e.data as string))
            .onError(() => this.elm.innerText = "test-bundle.js doesn't exist, cannot run tests.");
    }
}

ViewMap.add(TestView);

export default TestView;
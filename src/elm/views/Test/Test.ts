import "./Test.less";

import View from "../../../core/view/View";
import IApp from "../../../core/types/app/IApp";
import siteResources from "../../../core/siteResources";
import AppState from "../../../core/types/AppState";

class TestView extends View {
    public static cssName: string = "Test";
    public cssName = TestView.cssName;
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

export default TestView;
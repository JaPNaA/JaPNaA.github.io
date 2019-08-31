import "../../../../styles/views/ProjectInfo.less";

import IV1Card from "../../../types/project/v1/IV1Card";
import CardJSONv1Elm from "../../../components/jsonToElm/v1/card";
import IApp from "../../../core/types/app/IApp";
import openFrameView from "../../../utils/view/openFrameView";
import Widget from "../../../core/widget/Widget";

class ProjectInfoV1 extends Widget {
    public static widgetName = "projectInfoV1";
    public widgetName = ProjectInfoV1.widgetName;

    protected elm: HTMLDivElement;

    private cardElm: CardJSONv1Elm;

    constructor(app: IApp, project: IV1Card) {
        super();
        this.elm = document.createElement("div");
        this.cardElm = new CardJSONv1Elm(app, project);
    }

    public setup(): void {
        super.setup();

        this.cardElm.setup();
        this.cardElm.appendTo(this.elm);
        this.cardElm.animateTransitionIn();
        this.cardElm.addEventListeners();

        this.attachLinkClickHandler(this.cardElm.viewProjectButton);
    }

    public destory(): void {
        super.destory();
        this.cardElm.destory();
    }

    public canScroll(): boolean {
        return this.cardElm.canScroll();
    }

    private attachLinkClickHandler(elm: HTMLAnchorElement) {
        elm.addEventListener("click", this.linkClickHandler.bind(this, elm));
    }

    private linkClickHandler(elm: HTMLAnchorElement, event: MouseEvent) {
        const link = elm.href;
        openFrameView(link);

        event.preventDefault();
    }
}

export default ProjectInfoV1;
import css from "./ProjectInfo.less";

import IV1Card from "../../../../types/project/v1/IV1Card";
import CardJSONv1Elm from "../../../../components/jsonToElm/v1/card";
import IApp from "../../../../core/types/app/IApp";
import openFrameView from "../../../../utils/view/openFrameView";
import Widget from "../../../../core/widget/Widget";
import ISavableScroll from "../../../../components/viewPrivateData/saveScroll/ISaveScrollable";

class ProjectInfoV1 extends Widget implements ISavableScroll {
    public cssName = css.projectInfoV1;

    public scrollingElm: HTMLElement;

    protected elm: HTMLDivElement;

    private cardElm: CardJSONv1Elm;

    constructor(app: IApp, project: IV1Card) {
        super();
        this.elm = document.createElement("div");
        this.cardElm = new CardJSONv1Elm(app, project);
        this.scrollingElm = this.cardElm.scrollingElm;
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

    public getTitle(): string {
        return this.cardElm.getTitle();
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
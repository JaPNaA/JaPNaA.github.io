import IApp from "../../../core/types/app/IApp";
import IWithLocation from "../../../components/contentMan/IWithLocation";
import { V2Project } from "../../../types/project/v2/V2Types";

class LatestProjectCard {
    private elm: HTMLDivElement;

    private app: IApp;
    private card: IWithLocation<V2Project>;

    constructor(app: IApp, card: IWithLocation<V2Project>) {
        this.elm = document.createElement("div");

        this.app = app;
        this.card = card;
    }

    public setup(): void {
        this.elm.innerText = this.card.project.head.name;

        this.addEventHandlers();
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.elm);
    }

    private addEventHandlers(): void {
        this.elm.addEventListener("click", function () {
            //
        });
    }
}

export default LatestProjectCard;
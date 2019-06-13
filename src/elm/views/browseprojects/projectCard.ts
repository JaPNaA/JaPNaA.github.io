import ICard from "../../../types/project/card";
import isVisible from "../../../utils/isVisible";
import { Rect } from "../../../types/math/rect";

class ProjectCard {
    private card: ICard;
    private elm: HTMLDivElement;

    constructor(card: ICard) {
        this.card = card;
        this.elm = document.createElement("div");
        this.elm.classList.add("projectCard");
        this.elm.innerText = card.name;
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.elm);
    }

    public isVisible(): boolean {
        return isVisible(this.elm);
    }

    public setRect(rect: Rect): void {
        this.elm.style.position = "absolute";
        this.elm.style.display = "block";
        this.elm.style.top = rect.y + "px";
        this.elm.style.left = rect.x + "px";
        this.elm.style.width = rect.width + "px";
        this.elm.style.height = rect.height + "px";
    }

    /**
     * Loads assets
     */
    public load(): Promise<void> {
        return new Promise(res => {
            // this.elm.style.padding = Math.random() * 128 + "px"
            res(); // there's nothing to load... yet
        });
    }
}

export default ProjectCard;
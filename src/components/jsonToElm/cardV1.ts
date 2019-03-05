import "../../../styles/components/jsonToElm/cardV1.less";

import ICard from "../../interfaces/project/card";
import SiteConfig from "../../siteConfig";

class CardJSONv1Elm {
    private static transitionSpeed: number = 3000;
    private elm: HTMLDivElement;

    public constructor(project: ICard) {
        this.elm = this.parse(project);
    }

    public appendTo(parent: HTMLElement): void {
        parent.append(this.elm);
    }

    public animateTransitionIn() {
        this.elm.classList.add("beforeTransitionIn");

        requestAnimationFrame(() =>
            requestAnimationFrame(() =>
                this.elm.classList.add("afterTransitionIn")
            )
        );

        setTimeout(() => {
            this.elm.classList.remove("beforeTransitionIn");
            this.elm.classList.remove("afterTransitionIn");
        }, CardJSONv1Elm.transitionSpeed);
    }

    private parse(project: ICard): HTMLDivElement {
        const div = document.createElement("div");
        div.classList.add("card", "v1");

        this.createBackground(project, div);
        this.createInformationBlock(project, div);
        return div;
    }

    private createBackground(project: ICard, parent: HTMLDivElement): void {
        const bgImage = this.createBackgroundImage(project);
        if (bgImage) {
            parent.appendChild(bgImage);
        }

        const bgGradient = this.createBackgroundGradient();
        parent.appendChild(bgGradient);
    }

    private createBackgroundImage(project: ICard): HTMLDivElement | undefined {
        const display = project.content.display;
        if (!display[0]) { return; }
        const src = display[0].src;
        if (!src) { return; }

        const background = document.createElement("div");
        background.classList.add("background");

        if (project.style) {
            background.style.cssText = project.style;
        }

        background.style.backgroundImage = `url(${SiteConfig.thingyLink}${src})`;

        return background;
    }

    private createBackgroundGradient(): HTMLDivElement {
        const gradient = document.createElement("div");
        gradient.classList.add("backgroundGradient");
        return gradient;
    }

    private createInformationBlock(project: ICard, parent: HTMLDivElement): void {
        // TODO: jsformat
        const block = document.createElement("div");
        block.classList.add("infoBlock");

        {
            const name = document.createElement("h1");
            name.classList.add("name");
            name.innerText = project.name;
            block.appendChild(name);
        } {
            const no = document.createElement("span");
            no.innerText = project.no.toString();
            no.classList.add("no");
            block.appendChild(no);
        } {
            const tagsElm = document.createElement("ul");
            tagsElm.classList.add("tags");
            for (const tag of project.tags) {
                const tagElm = document.createElement("li");
                tagElm.innerText = tag;
                tagsElm.appendChild(tagElm);
            }
            block.appendChild(tagsElm);
        } {
            const author = document.createElement("div");
            author.innerText = project.author.join(", ");
            author.classList.add("author");
            block.appendChild(author);
        } {
            const description = document.createElement("div");
            description.classList.add("description");
            description.innerText = project.content.description;
            block.appendChild(description);
        } {
            // TODO: slice(1) instead
            const displays = project.content.display.slice(0);
            for (const display of displays) {
                const displayElm = document.createElement("div");
                displayElm.classList.add("display");
                if (display.type === "img") {
                    if (display.src) {
                        const img = document.createElement("img");
                        img.classList.add("img");
                        // POSSIBLE BUG: For all SiteConfig.thingyLink + ..., link could be absolute
                        img.src = SiteConfig.thingyLink + display.src;
                        displayElm.appendChild(img);
                    }
                    if (display.caption) {
                        const caption = document.createElement("small");
                        caption.innerText = display.caption;
                        caption.classList.add("caption");
                        displayElm.appendChild(caption);
                    }
                }
                block.appendChild(displayElm);
            }
        } {
            const link = document.createElement("a");
            link.classList.add("link");
            link.href = SiteConfig.thingyLink + project.content.link;
            block.appendChild(link);
        } {
            if (project.timestamp) {
                const time = document.createElement("div");
                time.classList.add("timestamp");
                time.innerText = new Date(project.timestamp).toLocaleDateString();
                block.appendChild(time);
            }
        }
        parent.appendChild(block);
    }
}

export default CardJSONv1Elm;
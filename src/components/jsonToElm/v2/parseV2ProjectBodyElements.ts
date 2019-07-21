import { V2ProjectBodyElement, V2ProjectBodyImage, V2ProjectBodyMarkdown, V2ProjectBodyViewProject } from "../../../types/project/v2/V2Types";
import siteConfig from "../../../SiteConfig";

type ParserFunction = (item: any) => HTMLDivElement;

const typeParserMap: { [x: string]: ParserFunction } = {
    "image": parseImage,
    "markdown": parseMarkdown,
    "view-project": parseViewProject
}

function parseV2ProjectBodyElements(elements: V2ProjectBodyElement[]): DocumentFragment {
    const frag = document.createDocumentFragment();

    for (const element of elements) {
        frag.appendChild(typeParserMap[element.type](element));
    }

    return frag;
}

function parseImage(item: V2ProjectBodyImage): HTMLDivElement {
    const elm = document.createElement("div");
    elm.classList.add("image");

    const img = document.createElement("img");
    img.src = siteConfig.path.thingy + item.src;
    elm.appendChild(img);

    if (item.caption) {
        const caption = document.createElement("div");
        caption.innerHTML = item.caption;
        elm.appendChild(caption);
    }

    return elm;
}

function parseMarkdown(item: V2ProjectBodyMarkdown): HTMLDivElement {
    const elm = document.createElement("div");
    elm.classList.add("markdown");
    elm.innerHTML = item.text;
    return elm;
}

function parseViewProject(item: V2ProjectBodyViewProject): HTMLDivElement {
    const a = document.createElement("a");
    a.innerText = "View Project";
    a.href = siteConfig.path.thingy + item.href;

    const elm = document.createElement("div");
    elm.classList.add("view-project");
    elm.appendChild(a);
    return elm;
}

export default parseV2ProjectBodyElements;
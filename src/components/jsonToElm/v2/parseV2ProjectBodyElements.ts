import { V2ProjectBodyElement, V2ProjectBodyImage, V2ProjectBodyMarkdown, V2ProjectBodyViewProject } from "../../../types/project/v2/V2Types";
import siteConfig from "../../../SiteConfig";

type ParserFunction = (item: any) => HTMLDivElement;

const typeParserMap: { [x: string]: ParserFunction } = {
    "image": parseImage,
    "markdown": parseMarkdown,
    "view-project": parseViewProject,
    "view-source": parseViewSource
}

function parseV2ProjectBodyElements(elements: V2ProjectBodyElement[]): DocumentFragment {
    const frag = document.createDocumentFragment();

    for (const element of elements) {
        const fn = typeParserMap[element.type];
        if (!fn) {
            console.warn("Unknown element type " + element.type + ". Element ignored");
            continue;
        }
        frag.appendChild(fn(element));
    }

    return frag;
}

function parseImage(item: V2ProjectBodyImage): HTMLDivElement {
    const elm = document.createElement("div");
    elm.classList.add("image");

    const inner = document.createElement("div");
    inner.classList.add("image-inner");
    elm.appendChild(inner);

    const img = document.createElement("img");
    img.src = siteConfig.path.thingy + item.src;
    img.alt = item.caption || "Image";
    inner.appendChild(img);

    if (item.caption) {
        const caption = document.createElement("div");
        caption.innerHTML = item.caption;
        caption.setAttribute("aria-hidden", "true"); // alt already contains caption
        inner.appendChild(caption);
    }

    if (item.pixels) {
        img.style.imageRendering = "pixelated";
        img.style.imageRendering = "crisp-edges";
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


function parseViewSource(item: V2ProjectBodyViewProject): HTMLDivElement {
    const a = document.createElement("a");
    a.innerText = "View Source";
    a.href = item.href;

    const elm = document.createElement("div");
    elm.classList.add("view-source");
    elm.appendChild(a);
    return elm;
}

export default parseV2ProjectBodyElements;
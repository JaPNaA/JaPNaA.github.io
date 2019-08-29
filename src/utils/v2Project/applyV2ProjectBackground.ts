import { V2Project } from "../../types/project/v2/V2Types";
import isCSSPropertyImage from "../css/isCSSPropertyImage";
import siteConfig from "../../SiteConfig";
import getImageSrcFromCSSProperty from "../css/getImageSrcFromCSSProperty";

/**
 * Applys a project's specified background to an element
 * @param project
 * @param elm to apply to
 * @returns the src of an image, if an image is used as background
 */
export default function applyV2ProjectBackground(project: V2Project, elm: HTMLElement): string | undefined {
    if (!project.head.background) { return; }
    let bgSrc;

    // loop backwards, so the first properties that work stays
    for (let i = project.head.background.length - 1; i >= 0; i--) {
        const background = project.head.background[i];
        if (isCSSPropertyImage(background)) {
            const urlValue = getImageSrcFromCSSProperty(background);
            if (urlValue) {
                const src = siteConfig.path.thingy + urlValue;
                elm.style.backgroundImage = "url(" + src + ")";
                bgSrc = src;
            } else {
                elm.style.backgroundImage = background;
            }
        } else {
            elm.style.backgroundColor = background;
        }
    }

    return bgSrc;
}
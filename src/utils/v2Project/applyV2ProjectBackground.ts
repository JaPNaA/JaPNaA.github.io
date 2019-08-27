import { V2Project } from "../../types/project/v2/V2Types";
import isCSSPropertyImage from "../css/isCSSPropertyImage";
import prependCSSUrl from "../css/prependCSSUrl";
import siteConfig from "../../SiteConfig";

export default function applyV2ProjectBackground(project: V2Project, elm: HTMLElement): void {
    if (!project.head.background) { return; }

    // loop backwards, so the first properties that work stays
    for (let i = project.head.background.length - 1; i >= 0; i--) {
        const background = project.head.background[i];
        if (isCSSPropertyImage(background)) {
            elm.style.backgroundImage =
                prependCSSUrl(siteConfig.path.thingy, background);
        } else {
            elm.style.backgroundColor = background;
        }
    }
}
import AppState from "../types/AppState";
import url from "url";
import AppStateBuilder from "./AppStateBuilder";

export default function parseAppStateURL(href: string | url.UrlWithStringQuery): AppState | undefined {
    let cleanURL;
    const builder = new AppStateBuilder();

    if (typeof href === "string") {
        cleanURL = url.parse(href);
    } else {
        cleanURL = href;
    }

    builder.hash = cleanURL.hash;

    if (!cleanURL.path) return;
    const cleanPath = cleanURL.path.slice(1);

    const divisorIndex = cleanPath.indexOf('/');
    if (divisorIndex < 0) {
        builder.viewName = cleanPath;
    } else {
        const viewName = cleanPath.slice(0, divisorIndex);
        const stateData = decodeURIComponent(cleanPath.slice(divisorIndex + 1));
        builder.viewName = viewName;
        builder.stateData = stateData;
    }

    try {
        return builder.build();
    } catch (err) {
        return undefined;
    }
}
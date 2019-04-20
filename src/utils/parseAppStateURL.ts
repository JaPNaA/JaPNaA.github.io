import AppState from "../types/appState";
import url from "url";

export default function parseAppStateURL(href: string | url.UrlWithStringQuery): AppState | undefined {
    let cleanURL;

    if (typeof href === "string") {
        cleanURL = url.parse(href);
    } else {
        cleanURL = href;
    }

    if (!cleanURL.path) return;
    const cleanPath = cleanURL.path.slice(1);

    const divisorIndex = cleanPath.indexOf('/');
    if (divisorIndex < 0) {
        return { viewName: cleanPath };
    } else {
        const viewName = cleanPath.slice(0, divisorIndex);
        const stateData = decodeURIComponent(cleanPath.slice(divisorIndex + 1));

        return { viewName, stateData };
    }
}
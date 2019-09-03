import AppState from "../types/AppState";
import url from "url";
import AppStateBuilder from "./AppStateBuilder";
import siteConfig from "../../SiteConfig";

export default function parseAppStateURL(href: string | url.UrlWithStringQuery): AppState | undefined {
    if (siteConfig.isAtRoot) {
        return parseAppStateURL_root(href);
    } else {
        return parseAppStateURL_hash(href);
    }
}

function parseAppStateURL_root(href: string | url.UrlWithStringQuery): AppState | undefined {
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

    const divisorIndex = cleanPath.indexOf(siteConfig.viewStateSeparator);
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

function parseAppStateURL_hash(href: string | url.UrlWithStringQuery): AppState | undefined {
    let cleanURL;

    if (typeof href === "string") {
        cleanURL = url.parse(href);
    } else {
        cleanURL = href;
    }

    if (cleanURL.hash) {
        return parseAppStateURL_root(cleanURL.hash.slice(1));
    } else {
        return undefined;
    }
}
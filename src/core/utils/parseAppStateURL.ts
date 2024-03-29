import AppState from "../types/AppState";
import AppStateBuilder from "./AppStateBuilder";
import siteConfig from "../../SiteConfig";

export default function parseAppStateURL(href: string | URL): AppState | undefined {
    let cleanURL;
    const builder = new AppStateBuilder();

    if (typeof href === "string") {
        cleanURL = new URL(href);
    } else {
        cleanURL = href;
    }

    builder.hash = cleanURL.hash;

    if (!cleanURL.pathname) return;
    let cleanPath = (cleanURL.pathname.slice(1) +
        (cleanURL.search || "")
    ) || cleanURL.hash || "";

    //! siteConfig.viewStateSeparator is not part of core, and should be removed
    const divisorIndex = cleanPath.indexOf(siteConfig.viewStateSeparator);
    if (divisorIndex < 0) {
        builder.viewPath = cleanPath;
    } else {
        const viewName = cleanPath.slice(0, divisorIndex);
        const stateData = decodeURIComponent(cleanPath.slice(divisorIndex + 1));
        builder.viewPath = viewName;
        builder.stateData = stateData;
    }

    try {
        return builder.build();
    } catch (err) {
        return undefined;
    }
}

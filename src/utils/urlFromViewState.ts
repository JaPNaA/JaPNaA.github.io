import resolveUrl from "./resolveUrl";
import ViewDescriptor from "../core/types/view/ViewDescriptor";
import AppState from "../core/types/AppState";
import siteConfig from "../SiteConfig";

export default function urlFromViewState(viewName: ViewDescriptor, state?: string | AppState): string {
    let str: string;

    if (typeof viewName === "string") {
        str = encodeURIComponent(viewName.toLowerCase());
    } else {
        str = encodeURIComponent(viewName.viewName.toLowerCase());
    }

    if (typeof state === "string") {
        str += siteConfig.viewStateSeparator + encodeURIComponent(state);
    } else if (state && state.stateData) {
        str += siteConfig.viewStateSeparator + encodeURIComponent(state.stateData);
    }

    return resolveUrl(str);
}
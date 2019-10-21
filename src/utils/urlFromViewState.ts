import resolveUrl from "./resolveUrl";
import AppState from "../core/types/AppState";
import siteConfig from "../SiteConfig";

export default function urlFromState(state: AppState): string {
    let str = state.viewPath;

    if (state.stateData) {
        str += siteConfig.viewStateSeparator + encodeURIComponent(state.stateData);
    }

    return resolveUrl(str);
}
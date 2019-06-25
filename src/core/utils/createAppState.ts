import AppState from "../types/AppState";
import ViewMetadata from "../types/view/ViewMetadata";

export default function createAppState(viewClass: ViewMetadata, stateData?: string, directURL?: string): AppState {
    return {
        viewName: viewClass.viewName,
        stateData: stateData,
        directURL: directURL
    };
}
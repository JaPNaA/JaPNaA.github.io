import AppState from "../types/appState";
import ViewMetadata from "../types/view/viewMetadata";

export default function createAppState(viewClass: ViewMetadata, stateData?: string, directURL?: string): AppState {
    return {
        viewName: viewClass.viewName,
        stateData: stateData,
        directURL: directURL
    };
}
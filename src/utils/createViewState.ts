import ViewClass from "../types/viewClass";
import AppState from "../types/appState";

export default function createViewState(viewClass: ViewClass, stateData?: string): AppState {
    return {
        viewName: viewClass.viewName,
        stateData: stateData
    };
}
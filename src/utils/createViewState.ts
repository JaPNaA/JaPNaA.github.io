import ViewClass from "../types/viewClass";
import AppState from "../types/appState";

export default function createAppState(viewClass: ViewClass, stateData?: string, directURL?: boolean): AppState {
    return {
        viewName: viewClass.viewName,
        stateData: stateData,
        directURL: directURL || false
    };
}
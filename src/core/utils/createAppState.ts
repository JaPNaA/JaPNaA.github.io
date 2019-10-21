import AppState from "../types/AppState";

export default function createAppState(path: string, stateData?: string, directURL?: string): AppState {
    return {
        viewPath: path,
        stateData: stateData,
        directURL: directURL
    };
}
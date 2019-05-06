import AppState from "../types/appState";

class AppStateBuilder implements AppState {
    viewName!: string;
    id?: number;
    stateData?: string;

    public build(): AppState {
        if (!this.viewName) { throw new Error("Missing viewName"); }
        return {
            viewName: this.viewName,
            id: this.id,
            stateData: this.stateData
        };
    }
}

export default AppStateBuilder;
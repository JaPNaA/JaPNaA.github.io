import AppState from "../types/appState";

class AppStateBuilder implements AppState {
    public viewName!: string;
    public id?: number;
    public stateData?: string;
    public hash?: string;

    public build(): AppState {
        if (this.viewName === "") { throw new Error("Missing viewName"); }
        return {
            viewName: this.viewName,
            id: this.id,
            stateData: this.stateData + ((this.hash) ? this.hash : "")
        };
    }
}

export default AppStateBuilder;
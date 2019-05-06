import AppState from "../types/appState";

class AppStateBuilder implements AppState {
    public viewName!: string;
    public id?: number;
    public stateData?: string;
    public hash?: string;

    public build(): AppState {
        if (!this.viewName && !this.hash) { throw new Error("Missing viewName"); }

        let viewName = this.viewName;
        let stateData = this.stateData;

        if (!this.viewName && this.hash) {
            viewName = this.hash;
        } else if (this.hash) {
            if (!stateData) {
                stateData = this.hash;
            } else {
                stateData += this.hash;
            }
        }

        return {
            viewName: viewName,
            id: this.id,
            stateData: stateData
        };
    }
}

export default AppStateBuilder;
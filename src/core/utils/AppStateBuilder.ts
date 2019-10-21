import AppState from "../types/AppState";

class AppStateBuilder implements AppState {
    public viewPath!: string;
    public id?: number;
    public stateData?: string;
    public hash?: string;
    public directURL?: string;

    public build(): AppState {
        if (!this.viewPath && !this.hash) { throw new Error("Missing viewName"); }

        let viewName = this.viewPath;
        let stateData = this.stateData;

        if (!this.viewPath && this.hash) {
            viewName = this.hash;
        } else if (this.hash) {
            if (!stateData) {
                stateData = this.hash;
            } else {
                stateData += this.hash;
            }
        }

        return {
            viewPath: viewName,
            stateData: stateData,
            directURL: this.directURL,
            id: this.id,
        };
    }
}

export default AppStateBuilder;
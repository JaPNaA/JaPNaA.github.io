import AppState from "../../types/AppState";

interface AppStateWithID extends AppState {
    id: number
}

class AppStateHistory {
    private static readonly maxLength = 100;

    private history: AppStateWithID[];

    constructor() {
        this.history = [];
    }

    public push(appState: AppState) {
        if (!this.hasID(appState)) { throw new Error("Cannot use AppState without ID"); }
        this.history.push(appState);
        if (this.history.length > AppStateHistory.maxLength) { this.history.shift(); }
    }

    public find(appState: AppState): AppState | undefined {
        if (this.hasID(appState)) {
            return this.findWithID(appState);
        } else {
            return this.findWithoutID(appState);
        }
    }

    public findByID(id: number): AppState | undefined {
        for (let i = this.history.length - 1; i >= 0; i--) {
            if (this.history[i].id === id) {
                return this.history[i];
            }
        }
    }


    private findWithID(appState: AppStateWithID): AppState | undefined {
        for (let i = this.history.length - 1; i >= 0; i--) {
            if (
                this.history[i].id === appState.id &&
                this.history[i].viewName.toLowerCase() === appState.viewName.toLowerCase() &&
                this.history[i].stateData === appState.stateData
            ) {
                return this.history[i];
            }
        }
    }

    private findWithoutID(appState: AppState): AppState | undefined {
        for (let i = this.history.length - 1; i >= 0; i--) {
            if (
                this.history[i].viewName.toLowerCase() === appState.viewName.toLowerCase() &&
                this.history[i].stateData === appState.stateData
            ) {
                return this.history[i];
            }
        }
    }

    private hasID(appState: AppState): appState is AppStateWithID {
        return appState.id !== undefined;
    }
}

export default AppStateHistory;
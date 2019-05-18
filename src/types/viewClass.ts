import View from "../elm/views/view";
import IApp from "./app/iApp";
import AppState from "./appState";

interface ViewClass {
    viewName: string;

    new(app: IApp, state: AppState): View;
}

export default ViewClass;
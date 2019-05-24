import View from "../view/view";
import IApp from "./app/iApp";
import AppState from "./appState";

interface ViewClass {
    viewName: string;
    viewMatcher?: RegExp;

    new(app: IApp, state: AppState): View;
}

export default ViewClass;
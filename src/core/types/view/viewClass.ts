import View from "../../view/view";
import IApp from "../app/iApp";
import AppState from "../appState";
import ViewMetadata from "./viewMetadata";

interface ViewClass extends ViewMetadata {
    new(app: IApp, state: AppState): View;
}

export default ViewClass;
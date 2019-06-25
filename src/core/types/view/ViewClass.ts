import View from "../../view/View";
import IApp from "../app/IApp";
import AppState from "../AppState";
import ViewMetadata from "./ViewMetadata";

interface ViewClass extends ViewMetadata {
    new(app: IApp, state: AppState): View;
}

export default ViewClass;
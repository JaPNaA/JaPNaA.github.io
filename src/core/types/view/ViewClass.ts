import View from "../../view/View";
import IApp from "../app/IApp";
import AppState from "../AppState";

interface ViewClass {
    new(app: IApp, state: AppState): View;
}

export default ViewClass;
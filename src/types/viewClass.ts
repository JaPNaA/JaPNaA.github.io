import View from "../elm/views/view";
import IApp from "./app/iApp";

interface ViewClass {
    viewName: string;

    new(app: IApp, stateData?: string): View;
}

export default ViewClass;
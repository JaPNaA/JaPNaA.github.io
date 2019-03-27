import Scene from "../elm/views/view";
import IApp from "./app";

interface ViewClass {
    viewName: string;

    new(app: IApp, stateData?: string): Scene;
}

export default ViewClass;
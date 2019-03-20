import Scene from "../elm/views/view";
import App from "../app";

interface ViewClass {
    viewName: string;

    new(app: App, stateData?: string): Scene;
}

export default ViewClass;
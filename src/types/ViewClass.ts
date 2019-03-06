import Scene from "../views/_view";
import App from "../app";

interface ViewClass {
    viewName: string;

    new(app: App): Scene;
}

export default ViewClass;
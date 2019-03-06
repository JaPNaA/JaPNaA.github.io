import Scene from "../views/view";
import App from "../app";

type ViewClass = new (app: App) => Scene;

export default ViewClass;
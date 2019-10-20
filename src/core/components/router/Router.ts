import ViewClass from "../../types/view/ViewClass";
import WidgetClass from "../../types/widget/WidgetClass";

type ClassImporter<T> = () => Promise<{ default: T }>;
type ViewClassImporter = ClassImporter<ViewClass>;
type WidgetClassImporter = ClassImporter<WidgetClass>;

type Routes = {
    [x: string]: WidgetClassImporter | ViewClassImporter | Router
};

class Router {
    private routes: Routes;
    private self?: ViewClassImporter;

    constructor(routes: Routes, self?: ViewClassImporter) {
        this.routes = routes;
        this.self = self;
    }

    public async getView(path: string): Promise<ViewClass> {
        throw new Error("not implemented");
    }

    public async getWidget(path: string): Promise<WidgetClass> {
        throw new Error("not implemented");
    }
}

export default Router;
import ViewClass from "../../types/view/ViewClass";

type ViewClassImporter = () => Promise<{ default: ViewClass }>;

type Routes = { [x: string]: ViewClassImporter | Router };

class Router {
    private routes: Routes;
    private self?: ViewClassImporter;

    constructor(routes: Routes, self?: ViewClassImporter) {
        this.routes = routes;
        this.self = self;
    }

    public async get(name: string): Promise<ViewClass> {
        throw new Error("not implemented");
    }
}

export default Router;
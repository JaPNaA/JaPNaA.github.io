import ViewClass from "../../types/view/ViewClass";
import WidgetClass from "../../types/widget/WidgetClass";
import NoRouteError from "./errors/NoRouteError";
import View from "../../view/View";
import NoViewError from "./errors/NoViewError";
import Widget from "../../widget/Widget";
import NoWidgetError from "./errors/NoWidgetError";
import Routes from "./Routes";
import ViewClassImporter from "./importers/ViewClassImporter";
import Route from "./Route";
import CaseInsensitiveMap from "../../utils/CaseInsensitiveMap";


class Router {
    private static readonly pathSplitter = ".";
    private routes: Routes;
    private self?: ViewClassImporter;

    /**
     * @param routes A map from string to Route. Uses CaseInsensitiveMap by default, override by creating your own Map
     * @param self the default path, if the user doesn't provide further paths
     */
    constructor(routes: Routes | [string, Route][], self?: ViewClassImporter) {
        if (routes instanceof Map) {
            this.routes = routes;
        } else {
            this.routes = new CaseInsensitiveMap(routes);
        }

        this.self = self;
    }

    public list(): string[] {
        return Object.keys(this.routes);
    }

    public async getView(path: string): Promise<ViewClass> {
        const resolved = this.resolveRoute(path);

        if (typeof resolved === 'function') {
            const viewOrWidget = await resolved();
            console.log(viewOrWidget.default);
            if (viewOrWidget.default.prototype instanceof View) {
                return viewOrWidget.default as ViewClass;
            } else {
                throw new NoViewError(path);
            }
        } else {
            throw new NoViewError(path);
        }
    }

    public async getWidget(path: string): Promise<WidgetClass> {
        const resolved = this.resolveRoute(path);

        if (typeof resolved === 'function') {
            const viewOrWidget = await resolved();
            if (viewOrWidget.default.prototype instanceof Widget) {
                return viewOrWidget.default as WidgetClass;
            } else {
                throw new NoWidgetError(path);
            }
        } else {
            throw new NoWidgetError(path);
        }
    }

    private resolveRoute(path: string): Route | undefined {
        const directories = this.splitPath(path);
        const name = directories.pop()!;

        let currRouter: Router = this;

        for (const directory of directories) {
            const router = currRouter.routes.get(directory);
            if (router instanceof Router) {
                currRouter = router;
            } else {
                throw new NoRouteError("directory '" + directory + "' in '" + path + "'");
            }
        }

        if (name.length === 0) {
            return currRouter.self;
        } else {
            return currRouter.routes.get(name);
        }
    }

    private splitPath(path: string): string[] {
        return path.split(Router.pathSplitter);
    }
}

export default Router;
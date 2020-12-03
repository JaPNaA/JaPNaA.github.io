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
import StringRegexMatchMap from "../../utils/CaseInsensitiveMap";


class Router {
    private static readonly pathSplitter = "/";
    private routes: Routes;
    private self?: ViewClassImporter;

    /**
     * @param routes A map from string to Route. Uses to construct CaseInsensitiveMap
     * @param self the default path, if the user doesn't provide further paths
     */
    constructor(routes: [string | RegExp, Route][], self?: ViewClassImporter) {
        this.routes = new StringRegexMatchMap(routes);

        this.self = self;
    }

    public list(): IterableIterator<string | RegExp> {
        return this.routes.keys();
    }

    public fixViewPath(path: string): string {
        // todo: actually fix it (this is currently an approximation)
        return path.toLowerCase();
    }

    public async getView(path: string): Promise<ViewClass> {
        const resolved = this.resolveViewOrWidget(path);

        if (typeof resolved === 'function') {
            const viewOrWidget = await resolved();
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
        const resolved = this.resolveViewOrWidget(path);

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

    public getRouter(path: string[]): Router {
        return this.resolveRouter(path);
    }

    private resolveViewOrWidget(path: string): Route | undefined {
        const directories = this.splitPath(path);
        const name = directories.pop()!;
        const router = this.resolveRouter(directories);

        if (name.length === 0) {
            return router.self;
        } else {
            return router.routes.get(name);
        }
    }

    private resolveRouter(path: string[]): Router {
        let currRouter: Router = this;

        for (const directory of path) {
            const router = currRouter.routes.get(directory);
            if (router instanceof Router) {
                currRouter = router;
            } else {
                throw new NoRouteError("directory '" + directory + "' in '" + path + "'");
            }
        }

        return currRouter;
    }

    private splitPath(path: string): string[] {
        return path.split(Router.pathSplitter);
    }
}

export default Router;
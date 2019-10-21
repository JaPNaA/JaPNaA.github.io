import Router from "../../core/components/router/Router";
import projectRoutes from "./project/routes";

const indexRoutes = new Router([
    ["about", () => import("./About/About")],
    ["commandPalette", () => import("./CommandPalette/CommandPalette")],
    ["errorView", () => import("./ErrorView/ErrorView")],
    ["frameView", () => import("./FrameView/FrameView")],
    ["imageView", () => import("./ImageView/ImageView")],
    ["menu", () => import("./Menu/Menu")],
    ["overview", () => import("./Overview/Overview")],
    ["project", projectRoutes],
    ["shortURL", () => import("./ShortURL/ShortURL")],
    ["splashScreen", () => import("./SplashScreen/SplashScreen")],
    ["test", () => import("./Test/Test")],
    ["view404", () => import("./View404/View404")],
    ["widgetView", () => import("./WidgetView/WidgetView")]
], () => import("./Overview/Overview"));

export default indexRoutes;
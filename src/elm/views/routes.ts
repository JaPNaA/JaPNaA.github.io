import Router from "../../core/components/router/Router";
import projectRoutes from "./project/routes";

const indexRoutes: Router = new Router([
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
    ["widgetView", () => import("./WidgetView/WidgetView")],

    ["checkbox", () => import("../widgets/Checkbox/Checkbox")],
    ["Global", () => import("../widgets/Global/Global")],
    ["HexagonsBackground", () => import("../widgets/HexagonsBackground/HexagonsBackground")],
    ["HexagonsTitle", () => import("../widgets/HexagonsTitle/HexagonsTitle")],
    ["HTMLView", () => import("../widgets/HTMLView/HTMLView")],
    ["IFrame", () => import("../widgets/IFrame/IFrame")],
    ["LatestProjects", () => import("../widgets/LatestProjects/LatestProjects")],
    ["ProjectCard", () => import("../widgets/ProjectCard/ProjectCard")],
    ["ProjectsGrid", () => import("../widgets/ProjectsGrid/ProjectsGrid")],
    ["RandomQuotes", () => import("../widgets/RandomQuotes/RandomQuotes")],
    ["Settings", () => import("../widgets/Settings/Settings")],
    ["StickyBar", () => import("../widgets/StickyBar/StickyBar")]
], () => import("./Overview/Overview"));

export default indexRoutes;
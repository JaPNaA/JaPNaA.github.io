import Router from "../../core/components/router/Router";
import projectRoutes from "./project/routes";

const indexRoutes: Router = new Router([
    ["project", projectRoutes],

    $$route("./About/About"),
    $$route("./CommandPalette/CommandPalette"),
    $$route("./ErrorView/ErrorView"),
    $$route("./FrameView/FrameView"),
    $$route("./ImageView/ImageView"),
    $$route("./Menu/Menu"),
    $$route("./Overview/Overview"),
    $$route("./ShortURL/ShortURL"),
    $$route("./SplashScreen/SplashScreen"),
    $$route("./Test/Test"),
    $$route("./View404/View404"),
    $$route("./WidgetView/WidgetView"),

    $$route("../widgets/Checkbox/Checkbox"),
    $$route("../widgets/Global/Global"),
    $$route("../widgets/HexagonsBackground/HexagonsBackground"),
    $$route("../widgets/HexagonsTitle/HexagonsTitle"),
    $$route("../widgets/HTMLView/HTMLView"),
    $$route("../widgets/IFrame/IFrame"),
    $$route("../widgets/LatestProjects/LatestProjects"),
    $$route("../widgets/ProjectCard/ProjectCard"),
    $$route("../widgets/ProjectsGrid/ProjectsGrid"),
    $$route("../widgets/RandomQuotes/RandomQuotes"),
    $$route("../widgets/Settings/Settings"),
    $$route("../widgets/StickyBar/StickyBar")
], () => import("./Overview/Overview"));

export default indexRoutes;
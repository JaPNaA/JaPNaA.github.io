import Router from "../../../core/components/router/Router";

const projectRoutes = new Router({
    browse: () => import("./browse/BrowseProjects"),
    directory: () => import("./directory/ProjectDirectory"),
    info: () => import("./info/ProjectInfo"),
    search: () => import("./search/Search")
});

export default projectRoutes;
import Router from "../../../core/components/router/Router";

const projectRoutes = new Router({
    browse: () => import("./browse/BrowseProjects")
});

export default projectRoutes;
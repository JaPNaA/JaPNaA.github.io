import Router from "../../../core/components/router/Router";

const projectRoutes = new Router([
    $$route("./browse/Browse"),
    $$route("./directory/Directory"),
    $$route("./info/Info"),
    $$route("./search/Search")
]);

export default projectRoutes;
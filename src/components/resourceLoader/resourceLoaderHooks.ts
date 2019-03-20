import Resource from "./resources/resource";
import Handler from "../../utils/events/handler";

class ResourceLoaderHooks {
    constructor(
        public onLoad: Handler<Resource>,
        public onError: Handler<Resource>
    ) { }
}

export default ResourceLoaderHooks;
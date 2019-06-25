import Resource from "./resources/Resource";
import Handler from "../../utils/events/Handler";

class ResourceLoaderHooks {
    constructor(
        public onLoad: Handler<Resource>,
        public onError: Handler<Resource>
    ) { }
}

export default ResourceLoaderHooks;
import ResourceCallback from "./resourceCallback";

class ResourceLoaderHooks {
    constructor(
        public onLoad: ResourceCallback,
        public onError: ResourceCallback
    ) { }
}

export default ResourceLoaderHooks;
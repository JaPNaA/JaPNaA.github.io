import ViewClass from "../types/view/viewClass";
import LazyClassMap from "../components/lazyClassMap/lazyClassMap";

class ViewMapClass extends LazyClassMap<ViewClass> {
    protected getNameFor(cls: ViewClass): string {
        return cls.viewName;
    }

    protected doesMatch(cls: ViewClass, name: string): boolean {
        return Boolean(cls.viewName.toLowerCase() === name.toLowerCase() || (
            cls.viewMatcher && cls.viewMatcher.test(name)
        ));
    }
}

const ViewMap = new ViewMapClass();

export default ViewMap;
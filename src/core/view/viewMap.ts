import ViewClass from "../types/viewClass";
import TypeStringMap from "../utils/typeStringMap";

class ViewMapClass extends TypeStringMap<ViewClass> {
    public add(cls: ViewClass): void {
        this.map.set(cls.viewName.toLowerCase(), cls);
    }

    public get(name: string): ViewClass | undefined {
        const value = this.map.get(name);
        if (value) { return value; }

        for (const [key, viewClass] of this) {
            if (
                viewClass.viewMatcher &&
                viewClass.viewMatcher.test(name)
            ) {
                return viewClass;
            }
        }
    }
}

const ViewMap = new ViewMapClass();

export default ViewMap;
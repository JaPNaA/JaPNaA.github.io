import ViewClass from "../../types/viewClass";
import TypeStringMap from "../../utils/typeStringMap";

class ViewMapClass extends TypeStringMap<ViewClass> {
    public add(cls: ViewClass): void {
        this.map.set(cls.viewName.toLowerCase(), cls);
    }
}

const ViewMap = new ViewMapClass();

export default ViewMap;
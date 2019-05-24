import WidgetClass from "../types/widgetClass";
import TypeStringMap from "../utils/typeStringMap";

class WidgetMapClass extends TypeStringMap<WidgetClass> {
    public add(cls: WidgetClass): void {
        this.map.set(cls.widgetName.toLowerCase(), cls);
    }
}

const WidgetMap = new WidgetMapClass();

export default WidgetMap;
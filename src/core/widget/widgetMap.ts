import WidgetClass from "../types/widget/widgetClass";
import LazyClassMap from "../components/lazyClassMap/lazyClassMap";

class WidgetMapClass extends LazyClassMap<WidgetClass> {
    protected getNameFor(cls: WidgetClass): string {
        return cls.widgetName;
    }

    protected doesMatch(cls: WidgetClass, name: string): boolean {
        return cls.widgetName.toLowerCase() === name.toLowerCase();
    }
}

const WidgetMap = new WidgetMapClass();

export default WidgetMap;
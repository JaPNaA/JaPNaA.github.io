import WidgetClass from "../types/widget/widgetClass";
import WidgetClassGhost from "./widgetClassGhost";
import Widget from "./widget";
import WidgetMap from "./widgetMap";

class WidgetFactory {
    static async create(widget: WidgetClass | WidgetClassGhost | string, args: any[]): Promise<Widget> {
        if (typeof widget === "string") {
            return new (await WidgetMap.get(widget))(...args);
        } else if (widget instanceof WidgetClassGhost) {
            return new (await widget.getClass())(...args);
        } else {
            return new widget(...args);
        }
    }
}

export default WidgetFactory;
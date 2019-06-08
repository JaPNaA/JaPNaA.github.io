import WidgetClass from "../types/widget/widgetClass";
import Widget from "./widget";
import WidgetMap from "./widgetMap";

class WidgetFactory {
    static async create(widget: WidgetClass | string, args: any[]): Promise<Widget> {
        if (typeof widget === "string") {
            return new (await WidgetMap.get(widget))(...args);
        } else {
            return new widget(...args);
        }
    }
}

export default WidgetFactory;
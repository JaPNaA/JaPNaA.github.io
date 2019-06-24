import WidgetClass from "../types/widget/widgetClass";
import Widget from "./widget";
import WidgetMap from "./widgetMap";

class WidgetFactory {
    static async create(widgetClass: WidgetClass | string, args: any[]): Promise<Widget> {
        let widget;
        if (typeof widgetClass === "string") {
            widget = new (await WidgetMap.get(widgetClass))(...args);
        } else {
            widget = new widgetClass(...args);
        }
        widget.setup();
        return widget;
    }
}

export default WidgetFactory;
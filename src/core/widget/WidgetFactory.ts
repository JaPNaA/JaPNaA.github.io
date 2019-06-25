import WidgetClass from "../types/widget/WidgetClass";
import Widget from "./Widget";
import WidgetMap from "./WidgetMap";

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
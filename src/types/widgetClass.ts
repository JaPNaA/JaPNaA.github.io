import Widget from "../elm/widgets/widget";

interface WidgetClass {
    widgetName: string;
    new(...args: any): Widget;
}

export default WidgetClass;
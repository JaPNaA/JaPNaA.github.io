import Widget from "../widget/widget";

interface WidgetClass {
    widgetName: string;
    new(...args: any): Widget;
}

export default WidgetClass;
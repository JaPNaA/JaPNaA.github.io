import Widget from "../../widget/Widget";

interface WidgetClass {
    new(...args: any): Widget;
}

export default WidgetClass;
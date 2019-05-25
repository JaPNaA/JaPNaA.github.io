import Widget from "../../widget/widget";
import WidgetMetadata from "./widgetMetadata";

interface WidgetClass extends WidgetMetadata {
    new(...args: any): Widget;
}

export default WidgetClass;
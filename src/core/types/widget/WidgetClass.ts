import Widget from "../../widget/Widget";
import WidgetMetadata from "./WidgetMetadata";

interface WidgetClass extends WidgetMetadata {
    new(...args: any): Widget;
}

export default WidgetClass;
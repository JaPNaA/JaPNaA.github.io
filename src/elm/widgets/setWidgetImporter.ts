import WidgetMap from "../../core/widget/widgetMap";
import widgetList from "./widgetList";

WidgetMap.useImporter((name: string) => {
    const lowerName = name.toLowerCase();
    const pathName = widgetList.find(
        widgetName => widgetName.toLowerCase() === lowerName
    );
    return import("./" + pathName + "/" + pathName)
});
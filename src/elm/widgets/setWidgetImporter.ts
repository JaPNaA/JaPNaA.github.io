import WidgetMap from "../../core/widget/widgetMap";
import lowerFirstChar from "../../utils/lowerFirstChar";

WidgetMap.useImporter((name: string) => {
    const pathName = lowerFirstChar(name);
    return import("./" + pathName + "/" + pathName)
});
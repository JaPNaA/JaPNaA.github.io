import WidgetMap from "../../core/widget/widgetMap";

WidgetMap.useImporter((name: string) => {
    const pathName = name.toLowerCase();
    return import("./" + pathName + "/" + pathName)
});
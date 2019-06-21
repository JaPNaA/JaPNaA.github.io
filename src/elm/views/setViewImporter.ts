import ViewMap from "../../core/view/viewMap";
import viewList from "./viewList";

ViewMap.useImporter((name: string) => {
    const lowerName = name.toLowerCase();
    const pathName = viewList.find(
        viewName => viewName.toLowerCase() === lowerName
    );
    return import("./" + pathName + "/" + pathName);
});
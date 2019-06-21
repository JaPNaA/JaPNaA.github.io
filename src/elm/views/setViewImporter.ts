import ViewMap from "../../core/view/viewMap";
import viewList from "./viewList";

ViewMap.useImporter((name: string) => {
    const pathName = viewList.find(
        viewName => name.toLowerCase() === viewName.toLowerCase()
    );
    return import("./" + pathName + "/" + pathName);
});
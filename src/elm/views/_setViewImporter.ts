import ViewMap from "../../core/view/ViewMap";
import viewList from "./viewList";

ViewMap.useImporter((name: string) => {
    const lowerName = name.toLowerCase();
    let pathName;

    for (const viewEntry of viewList) {
        if (Array.isArray(viewEntry)) {
            if (
                viewEntry[0].toLowerCase() === lowerName ||
                viewEntry[1].test(name)
            ) {
                pathName = viewEntry[0];
                break;
            }
        } else {
            if (viewEntry.toLowerCase() === lowerName) {
                pathName = viewEntry;
                break;
            }
        }
    }

    return import("./" + pathName + "/" + pathName);
});
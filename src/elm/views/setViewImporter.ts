import ViewMap from "../../core/view/viewMap";

ViewMap.useImporter((name: string) => {
    const pathName = name.toLowerCase();
    return import("./" + pathName + "/" + pathName)
});
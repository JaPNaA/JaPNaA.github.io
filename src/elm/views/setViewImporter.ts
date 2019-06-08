import ViewMap from "../../core/view/viewMap";
import lowerFirstChar from "../../utils/lowerFirstChar";

ViewMap.useImporter((name: string) => {
    const pathName = lowerFirstChar(name);
    return import("./" + pathName + "/" + pathName)
});
import "./imageView/imageView";
import "./404/404";
import "./splashScreen/splashScreen";
import ViewMap from "../../core/view/viewMap";
import ViewClassGhost from "../../core/view/viewClassGhost";

ViewMap.add(new ViewClassGhost("imageView", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("404", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("allThingies", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("frameView", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("menu", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("overview", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("projectInfo", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("shortUrl", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("test", () => import("./imageView/imageView")));
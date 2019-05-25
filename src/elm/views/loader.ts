import "./imageView/imageView";
import "./404/404";
import "./splashScreen/splashScreen";
import ViewMap from "../../core/view/viewMap";
import ViewClassGhost from "../../core/view/viewClassGhost";

ViewMap.add(new ViewClassGhost("imageView", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("404", () => import("./404/404")));
ViewMap.add(new ViewClassGhost("allThingies", () => import("./allThingies/allThingies")));
ViewMap.add(new ViewClassGhost("frameView", () => import("./frameView/frameView")));
ViewMap.add(new ViewClassGhost("menu", () => import("./menu/menu")));
ViewMap.add(new ViewClassGhost("overview", () => import("./overview/overview")));
ViewMap.add(new ViewClassGhost("projectInfo", () => import("./projectInfo/projectInfo")));
ViewMap.add(new ViewClassGhost("shortUrl", () => import("./shortUrl/shortUrl")));
ViewMap.add(new ViewClassGhost("test", () => import("./test/test")));
import ViewMap from "../../core/view/viewMap";
import ViewClassGhost from "../../core/view/viewClassGhost";

ViewMap.add(new ViewClassGhost("ImageView", () => import("./imageView/imageView")));
ViewMap.add(new ViewClassGhost("404", () => import("./404/404")));
ViewMap.add(new ViewClassGhost("AllThingies", () => import("./allThingies/allThingies")));
ViewMap.add(new ViewClassGhost("FrameView", () => import("./frameView/frameView")));
ViewMap.add(new ViewClassGhost("Menu", () => import("./menu/menu")));
ViewMap.add(new ViewClassGhost("Overview", () => import("./overview/overview")));
ViewMap.add(new ViewClassGhost("ProjectInfo", () => import("./projectInfo/projectInfo")));
ViewMap.add(new ViewClassGhost("ShortUrl", () => import("./shortUrl/shortUrl")));
ViewMap.add(new ViewClassGhost("Test", () => import("./test/test")));
import "./global/global";

import WidgetMap from "../../core/widget/widgetMap";
import WidgetClassGhost from "../../core/widget/widgetClassGhost";

WidgetMap.add(new WidgetClassGhost("hexagonsTitle", () => import("./hexagonsTitle/hexagonsTitle")));
WidgetMap.add(new WidgetClassGhost("iframe", () => import("./iframe/iframe")));
WidgetMap.add(new WidgetClassGhost("latestProjects", () => import("./latestProjects/latestProjects")));
WidgetMap.add(new WidgetClassGhost("stickyBar", () => import("./stickyBar/stickyBar")));
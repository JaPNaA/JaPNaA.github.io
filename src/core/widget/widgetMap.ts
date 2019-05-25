import WidgetClass from "../types/widget/widgetClass";
import ClassAndGhostMap from "../components/classGhost/classAndGhostMap";
import WidgetClassGhost from "./widgetClassGhost";

class WidgetMapClass extends ClassAndGhostMap<WidgetClass, WidgetClassGhost> {
    protected getNameFor(cls: WidgetClass | WidgetClassGhost): string {
        return cls.widgetName;
    }

    protected isGhost(cls: WidgetClass | WidgetClassGhost): cls is WidgetClassGhost {
        return cls instanceof WidgetClassGhost;
    }

    protected doesMatch(cls: WidgetClass | WidgetClassGhost, name: string): boolean {
        return cls.widgetName.toLowerCase() === name.toLowerCase();
    }

    protected getBodyFromGhost(ghost: WidgetClassGhost): Promise<WidgetClass> {
        return ghost.getClass();
    }
}

const WidgetMap = new WidgetMapClass();

export default WidgetMap;
import ViewClass from "../types/view/viewClass";
import ViewClassGhost from "./viewClassGhost";
import ClassAndGhostMap from "../components/classGhost/classAndGhostMap";

class ViewMapClass extends ClassAndGhostMap<ViewClass, ViewClassGhost> {
    protected getNameFor(cls: ViewClass | ViewClassGhost): string {
        return cls.viewName;
    }

    protected isGhost(cls: ViewClass | ViewClassGhost): cls is ViewClassGhost {
        return cls instanceof ViewClassGhost;
    }

    protected doesMatch(cls: ViewClass | ViewClassGhost, name: string): boolean {
        return Boolean(cls.viewName.toLowerCase() === name.toLowerCase() || (
            cls.viewMatcher && cls.viewMatcher.test(name)
        ));
    }

    protected getBodyFromGhost(ghost: ViewClassGhost): Promise<ViewClass> {
        return ghost.getClass();
    }
}

const ViewMap = new ViewMapClass();

export default ViewMap;
import ViewClass from "../types/view/viewClass";
import ViewClassGhost from "./viewClassGhost";

class ViewMapClass {
    private map: Map<string, ViewClass | ViewClassGhost>;

    constructor() {
        this.map = new Map();
    }

    public add(cls: ViewClass): void {
        this.map.set(cls.viewName.toLowerCase(), cls);
    }

    public [Symbol.iterator](): IterableIterator<[string, ViewClass | ViewClassGhost]> {
        return this.map[Symbol.iterator]();
    }

    public async get(name: string): Promise<ViewClass | undefined> {
        const value = this.getClassOrGhost(name);
        if (!value) { return; }

        if (value instanceof ViewClassGhost) {
            return value.getClass();
        } else {
            return value;
        }
    }

    private getClassOrGhost(name: string): ViewClass | ViewClassGhost | undefined {
        const value = this.map.get(name);
        if (value) { return value; }

        for (const [key, cls] of this.map) {
            if (
                cls.viewMatcher &&
                cls.viewMatcher.test(name)
            ) {
                return cls;
            }
        }
    }
}

const ViewMap = new ViewMapClass();

export default ViewMap;
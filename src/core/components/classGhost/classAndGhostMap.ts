abstract class ClassAndGhostMap<T, TGhost> {
    private map: Map<string, T | TGhost>;

    constructor() {
        this.map = new Map();
    }

    protected abstract getNameFor(cls: T | TGhost): string;
    protected abstract isGhost(cls: T | TGhost): cls is TGhost;
    protected abstract doesMatch(cls: T | TGhost, name: string): boolean;
    protected abstract getBodyFromGhost(ghost: TGhost): Promise<T>;

    public add(cls: T | TGhost): void {
        const clsName = this.getNameFor(cls);
        const existing = this.map.get(clsName);
        if (existing && !this.isGhost(existing) && this.isGhost(cls)) {
            console.error("Attempted to replace existing item with ghost");
            return;
        }

        this.map.set(clsName, cls);
    }

    public [Symbol.iterator](): IterableIterator<[string, T | TGhost]> {
        return this.map[Symbol.iterator]();
    }

    public async get(name: string): Promise<T> {
        const value = this.getClassOrGhost(name.toLowerCase());
        if (!value) { throw new Error("View \"" + name + "\" doesn't exist"); }

        if (this.isGhost(value)) {
            return this.getBodyFromGhost(value);
        } else {
            return value;
        }
    }

    private getClassOrGhost(name: string): T | TGhost | undefined {
        const value = this.map.get(name);
        if (value) { return value; }

        for (const [key, cls] of this.map) {
            if (
                this.doesMatch(cls, name)
            ) {
                return cls;
            }
        }
    }
}

export default ClassAndGhostMap;
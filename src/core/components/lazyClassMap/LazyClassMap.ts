import ClassImporterFunction from "../../types/ClassImporterFunction";
import siteResources from "../../siteResources";

abstract class LazyClassMap<T> {
    private map: Map<string, T>;
    private importWithName?: ClassImporterFunction<T>;

    constructor() {
        this.map = new Map();
    }

    protected abstract getNameFor(cls: T): string;
    protected abstract doesMatch(cls: T, name: string): boolean;

    public useImporter(importer: ClassImporterFunction<T>) {
        this.importWithName = importer;
    }

    public add(cls: T): void {
        const clsName = this.getNameFor(cls);
        this.map.set(clsName, cls);
    }

    public [Symbol.iterator](): IterableIterator<[string, T]> {
        return this.map[Symbol.iterator]();
    }

    public async get(name: string): Promise<T> {
        const value = this.getClass(name.toLowerCase());
        if (!value) {
            if (this.importWithName) {
                try {
                    siteResources.addResourceLoading();
                    return (await this.importWithName(name.toLowerCase())).default;
                } catch (err) {
                    throw new Error("View \"" + name + "\" doesn't exist, tried importing.");
                } finally {
                    siteResources.addResourceLoaded();
                }
            } else {
                throw new Error("View \"" + name + "\" doesn't exist, no importer used.");
            }
        }

        return value;
    }

    private getClass(name: string): T | undefined {
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

export default LazyClassMap;
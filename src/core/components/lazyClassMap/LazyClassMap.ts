import ClassImporterFunction from "../../types/ClassImporterFunction";
import siteResources from "../../siteResources";
import wait from "../../../utils/wait";

abstract class LazyClassMap<T> {
    private static doPrefetchs: boolean = true;

    private map: Map<string, T>;
    private importWithName?: ClassImporterFunction<T>;

    constructor() {
        this.map = new Map();
    }

    public static stopPrefetches(): void {
        LazyClassMap.doPrefetchs = false;
    }

    public static continuePrefetches(): void {
        LazyClassMap.doPrefetchs = true;
    }

    public async prefetch(name: string): Promise<void> {
        await siteResources.nextIdle();
        if (!LazyClassMap.doPrefetchs || !this.importWithName) { return; }

        try {
            await this.importWithName(name);
        } catch (err) {
            console.warn("Failed to prefetch " + name);
        }
    }

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

    protected abstract getNameFor(cls: T): string;
    protected abstract doesMatch(cls: T, name: string): boolean;

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
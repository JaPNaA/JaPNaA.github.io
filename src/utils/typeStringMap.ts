abstract class TypeStringMap<T> {
    protected map = new Map<string, T>();

    public abstract add(cls: T): void;

    public get(name: string): T | undefined {
        return this.map.get(name.toLowerCase());
    }

    public *[Symbol.iterator](): IterableIterator<[string, T]> {
        for (const i of this.map) {
            yield i;
        }
    }
}

export default TypeStringMap;
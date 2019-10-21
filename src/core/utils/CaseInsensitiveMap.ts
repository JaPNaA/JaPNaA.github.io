class CaseInsensitiveMap<T> implements Map<string, T> {
    private map: Map<string, T>;

    constructor(arr?: [string, T][]) { this.map = new Map(arr); }

    public get(key: string): T | undefined {
        return this.map.get(key.toLowerCase());
    }

    public set(key: string, value: T): this {
        this.map.set(key.toLowerCase(), value);
        return this;
    }

    // typescript doesn't extend map, so just forward all the calls to the actual map
    public clear(): void { return this.map.clear(); }
    public delete(key: string): boolean { return this.map.delete(key); }
    public forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void { return this.map.forEach(callbackfn); }
    public has(key: string): boolean { return this.map.has(key); }
    public get size(): number { return this.map.size; }
    public [Symbol.iterator](): IterableIterator<[string, T]> { return this.map[Symbol.iterator](); }
    public entries(): IterableIterator<[string, T]> { return this.map.entries(); }
    public keys(): IterableIterator<string> { return this.map.keys(); }
    public values(): IterableIterator<T> { return this.map.values(); }
    public get [Symbol.toStringTag](): string { return this.map[Symbol.toStringTag]; }
}

export default CaseInsensitiveMap;
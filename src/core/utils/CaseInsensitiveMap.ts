class StringRegexMatchMap<T> implements Map<string | RegExp, T> {
    private map: Map<string | RegExp, T>;

    constructor(arr?: [string | RegExp, T][]) {
        this.map = new Map(
            arr && arr.map(
                e => typeof e[0] === "string" ? [e[0].toLowerCase(), e[1]] : e
            )
        );
    }

    public get(key: string): T | undefined {
        const stringMatch = this.map.get(key.toLowerCase());
        if (stringMatch) { return stringMatch; }

        for (const [regex, value] of this.map) {
            if (!(regex instanceof RegExp)) { continue; }
            if (regex.test(key)) { return value; }
        }
    }

    public set(key: string, value: T): this {
        this.map.set(key.toLowerCase(), value);
        return this;
    }

    // typescript doesn't extend map, so just forward all the calls to the actual map
    public clear(): void { return this.map.clear(); }
    public delete(key: string): boolean { return this.map.delete(key); }
    public forEach(callbackfn: (value: T, key: string | RegExp, map: Map<string | RegExp, T>) => void, thisArg?: any): void { return this.map.forEach(callbackfn); }
    public has(key: string): boolean { return this.map.has(key); }
    public get size(): number { return this.map.size; }
    public [Symbol.iterator](): IterableIterator<[string | RegExp, T]> { return this.map[Symbol.iterator](); }
    public entries(): IterableIterator<[string | RegExp, T]> { return this.map.entries(); }
    public keys(): IterableIterator<string | RegExp> { return this.map.keys(); }
    public values(): IterableIterator<T> { return this.map.values(); }
    public get [Symbol.toStringTag](): string { return this.map[Symbol.toStringTag]; }
}

export default StringRegexMatchMap;
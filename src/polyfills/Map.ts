export default function apply() {
    // @ts-ignore
    window.Map = MapPolyfill;
}

class MapPolyfill<K, V> implements Map<K, V> {
    public size: number;
    public [Symbol.toStringTag]: string = "Map";
    private mapEntries: [K, V][];

    constructor(entries?: ReadonlyArray<readonly [K, V]>) {
        this.size = 0;
        this.mapEntries = [];

        if (entries) {
            for (const entry of entries) {
                this.mapEntries.push([entry[0], entry[1]]);
            }
        }
    }

    clear(): void {
        this.mapEntries.length = 0;
    }

    delete(key: K): boolean {
        for (let i = 0, length = this.mapEntries.length; i < length; i++) {
            if (this.mapEntries[i][0] === key) {
                this.mapEntries.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        for (const entry of this.mapEntries) {
            callbackfn(entry[1], entry[0], this);
        }
    }

    get(key: K): V | undefined {
        for (const entry of this.mapEntries) {
            if (entry[0] === key) {
                return entry[1];
            }
        }

        return undefined;
    }

    has(key: K): boolean {
        for (const entry of this.mapEntries) {
            if (entry[0] === key) {
                return true;
            }
        }

        return false;
    }

    set(key: K, value: V): this {
        for (const entry of this.mapEntries) {
            if (entry[0] === key) {
                entry[1] = value;
                return this;
            }
        }

        this.mapEntries.push([key, value]);
        return this;
    }

    *[Symbol.iterator](): IterableIterator<[K, V]> {
        for (const entry of this.mapEntries) {
            yield entry;
        }
    }

    *entries(): IterableIterator<[K, V]> {
        for (const entry of this.mapEntries) {
            yield entry;
        }
    }

    *keys(): IterableIterator<K> {
        for (const entry of this.mapEntries) {
            yield entry[0];
        }
    }

    *values(): IterableIterator<V> {
        for (const entry of this.mapEntries) {
            yield entry[1];
        }
    }
}
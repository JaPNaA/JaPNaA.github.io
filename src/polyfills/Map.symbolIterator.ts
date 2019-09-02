export default function apply() {
    // @ts-ignore
    Map.prototype[Symbol.iterator] = function* (this: Map<any, any>) {
        const arr: any[] = [];

        this.forEach(function (value, key) {
            arr.push([key, value]);
        });

        for (const value of arr) {
            yield value;
        }
    };
}
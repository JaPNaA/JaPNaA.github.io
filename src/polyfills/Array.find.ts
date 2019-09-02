export default function apply() {
    Array.prototype.find = function (cb: (this: void, value: any, index: number, obj: any[]) => boolean) {
        for (let i = 0, length = this.length; i < length; i++) {
            if (cb(this[i], i, this)) {
                return this[i];
            }
        }
    };
}
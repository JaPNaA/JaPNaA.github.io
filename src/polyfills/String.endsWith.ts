export default function apply() {
    String.prototype.endsWith = function(searchString: string, position: number): boolean {
        return this.slice(this.length - searchString.length) === searchString;
    }
}
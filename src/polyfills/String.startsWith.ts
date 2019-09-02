export default function apply() {
    String.prototype.startsWith = function(searchString: string, position: number = 0): boolean {
        return this.substr(position, searchString.length) === searchString;
    };
}
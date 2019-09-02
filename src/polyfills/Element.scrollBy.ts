export default function apply() {
    Element.prototype.scrollBy = function(options: number | ScrollToOptions | undefined) {
        if (typeof options === "number") {
            this.scrollTop += options;
        } else if (typeof options === "undefined") {
        } else {
            this.scrollTop += options.top || 0;
            this.scrollTop += options.left || 0;
        }
    }
}
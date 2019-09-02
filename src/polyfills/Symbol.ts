export default function apply() {
    let count = 0;

    // @ts-ignore
    window.Symbol = function(name) {
        if (name) {
            return "___symbol_polyfill__Symbol(" + name + ")";
        } else {
            return "___symbol_polyfill__Symbol(" + (count++) + ")";
        }
    };

    // @ts-ignore
    Symbol.iterator = Symbol("Symbol(iterator)");
    // @ts-ignore
    Symbol.asyncIterator = Symbol("Symbol(asyncIterator)");
};
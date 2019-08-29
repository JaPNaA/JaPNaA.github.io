export default function htmlCollectionToArray(collection: HTMLCollection): Element[] {
    return [].slice.call(collection);
}
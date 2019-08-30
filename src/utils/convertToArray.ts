export default function htmlCollectionToArray<T extends Element>(collection: HTMLCollectionOf<T> | HTMLCollection): T[] {
    return [].slice.call(collection);
}
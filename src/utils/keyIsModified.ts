export default function keyIsModified(e: KeyboardEvent | MouseEvent): boolean {
    return e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
}
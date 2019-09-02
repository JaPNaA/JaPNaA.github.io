export default function apply() {
    // @ts-ignore
    window.CSS = {
        supports(): boolean {
            return false;
        }
    };
}
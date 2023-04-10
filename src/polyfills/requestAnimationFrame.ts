export default function requestAnimationFrame() {
    window.requestAnimationFrame =
        // @ts-ignore
        window.webkitRequestAnimationFrame ||
        // @ts-ignore
        window.mozRequestAnimationFrame ||
        // @ts-ignore
        window.oRequestAnimationFrame ||
        function (cb: (now: number) => void): number {
            return window.setTimeout(() =>
                cb(performance.now()),
                100 / 3
            );
        };
    
    window.cancelAnimationFrame =
        // @ts-ignore
        window.webkitCancelAnimationFrame ||
        // @ts-ignore
        window.mozCancelAnimationFrame ||
        // @ts-ignore
        window.oCancelAnimationFrame ||
        function (handle: number): void {
            clearTimeout(handle);
        };
}
export default function requestAnimationFrame() {
    window.requestAnimationFrame =
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
        window.webkitCancelAnimationFrame ||
        // @ts-ignore
        window.mozCancelAnimationFrame ||
        // @ts-ignore
        window.oCancelAnimationFrame ||
        function (handle: number): void {
            clearTimeout(handle);
        };
}
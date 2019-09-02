export default function apply() {
    // @ts-ignore
    window.__performance_now_polyfill__startTime = Date.now();
    
    Performance.prototype.now = function(): number {
        // @ts-ignore
        return Date.now() - window.__performance_now_polyfill__startTime;
    };
}
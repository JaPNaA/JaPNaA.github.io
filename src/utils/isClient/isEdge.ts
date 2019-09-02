export default function isEdge(): boolean {
    return navigator.userAgent.indexOf('Edge/') > 0;
}
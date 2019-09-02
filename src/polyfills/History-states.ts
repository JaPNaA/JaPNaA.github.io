export default function apply() {
    History.prototype.pushState = function(data: any, title: string, url: string) {
        document.title = title;
    };

    History.prototype.replaceState = function(data: any, title: string, url: string) {
        document.title = title;
    };

    // @ts-ignore
    History.prototype.state = "";
}
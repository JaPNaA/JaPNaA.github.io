import SiteResources from "../core/siteResources";

const PING = "/ping";

export default function getServerTime(): Promise<Date> {
    const x = new XMLHttpRequest();
    x.open("GET", PING);
    SiteResources.addResourceLoading();

    x.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
    x.setRequestHeader('cache-control', 'max-age=0');
    x.setRequestHeader('expires', '0');
    x.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
    x.setRequestHeader('pragma', 'no-cache');

    const promise = new Promise<Date>((res, rej) => {
        x.addEventListener("load", function () {
            const date = x.getResponseHeader("Date");
            if (!date) {
                rej("No date in header");
            } else {
                res(new Date(date));
            }

            SiteResources.addResourceLoaded();
        });
        x.addEventListener("error", function () {
            rej();
            SiteResources.addResourceLoaded();
        });
    });

    x.send();

    return promise;
};
import SiteResources from "../siteResources";

const PING = "/ping";

export default function getServerTime(): Promise<Date> {
    const promise = new Promise<Date>((res, rej) => {
        SiteResources.deleteResource(PING);
        SiteResources.loadText(PING)
            .onLoad(e => {
                const date = e.req.getResponseHeader("Date");
                if (!date) {
                    rej("No date in header");
                } else {
                    res(new Date(date));
                }
            })
            .onError(e => {
                rej(e.error)
            });
    });

    return promise;
};
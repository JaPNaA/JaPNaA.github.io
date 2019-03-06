import SiteConfig from "../../siteConfig";

class URLManager {
    constructor() {
        //
    }

    public static setState(viewName: string, viewStateData?: string): void {
        // this.viewName = viewName;
        // this.viewStateData = viewStateData;

        const viewNameEnc = encodeURIComponent(viewName.toLowerCase());
        
        let newURL = viewNameEnc;
        
        if (viewStateData) {
            const dataEnc = encodeURIComponent(viewStateData);
            newURL += "/" + dataEnc;
        }

        history.replaceState(
            null,
            SiteConfig.title + "." + encodeURIComponent(viewName),
            newURL
        );
    }
}

export default URLManager;
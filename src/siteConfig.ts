import isHandheld from "./utils/isHandheld";
import isMobile from "./utils/isMobile";
import isIOS from "./utils/isIOS";

class SiteConfig {
    static thingyLink: string;
    static title: string = "JaPNaA";

    static path = {
        img: {
            hexagon: "/assets/img/hexagon.svg",
            logo: "/assets/img/japnaa-logo.svg",
            hamburger: "/assets/img/hamburger.svg",
            close: "/assets/img/close.svg"
        },
    
        view: {
            overview: "/assets/views/overview.html"
        },
    
        content: "/assets/content/"
    }

    static hexagonsTitle = {
        hexagonsPerLayer: 50,
        layers: 4
    };

    static isHandheld: boolean;
    static isMobile: boolean;
    static isIOS: boolean;
}

// matches localhost and ips, for debugging
const match = location.href.match(/^https?:\/\/(((\d+\.){3}\d+)|(localhost)):/);
if (match) {
    const port = parseInt(location.port);
    if (!isNaN(port)) {
        SiteConfig.thingyLink = match[0] + (port + 1);
    }
} else {
    SiteConfig.thingyLink = "";
}

SiteConfig.isHandheld = isHandheld();
SiteConfig.isMobile = isMobile();
SiteConfig.isIOS = isIOS();

export default SiteConfig;
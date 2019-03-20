import isHandheld from "./utils/isHandheld";
import isMobile from "./utils/isMobile";

class SiteConfig {
    static thingyLink: string;
    static title: string = "JaPNaA";

    static paths = {
        hexagon: "/img/hexagon.svg",
        logo: "/img/japnaa-logo.svg",
        hamburger: "/img/hamburger.svg"
    };

    static hexagonsTitle = {
        hexagonsPerLayer: 50,
        layers: 4
    };

    static isHandheld: boolean;
    static isMobile: boolean;
}

if (location.href.includes("localhost")) {
    const port = parseInt(location.port);
    if (!isNaN(port)) {
        SiteConfig.thingyLink = "http://localhost:" + (port + 1);
    }
} else {
    SiteConfig.thingyLink = "";
}

SiteConfig.isHandheld = isHandheld();
SiteConfig.isMobile = isMobile();

export default SiteConfig;
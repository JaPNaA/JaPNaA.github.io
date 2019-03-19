class SiteConfig {
    static thingyLink: string;
    static title: string = "JaPNaA";

    static paths = {
        hexagon: "./img/hexagon.svg",
        logo: "./img/japnaa-logo.svg"
    };

    static hexagonsTitle = {
        hexagonsPerLayer: 50,
        layers: 4
    };
}

if (location.href.includes("localhost")) {
    SiteConfig.thingyLink = "http://localhost:8081";
} else {
    SiteConfig.thingyLink = "";
}

export default SiteConfig;
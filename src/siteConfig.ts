class SiteConfig {
    static thingyLink: string;
    static title: string = "JaPNaA";
}

if (location.href.includes("localhost")) {
    SiteConfig.thingyLink = "http://localhost:8081";
} else {
    SiteConfig.thingyLink = "";
}

export default SiteConfig;
class SiteConfig {
    static thingyLink: string;
}

if (location.href.includes("localhost")) {
    SiteConfig.thingyLink = "http://localhost:8081";
} else {
    SiteConfig.thingyLink = "";
}

export default SiteConfig;
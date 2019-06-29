import isHandheld from "./utils/isHandheld";
import isMobile from "./utils/isMobile";
import isIOS from "./utils/isIOS";
import getServerTime from "./utils/getServerTime";
import { resolve } from "url";
import connectionIsMetered from "./utils/connectionIsMetered";
import LazyClassMap from "./core/components/lazyClassMap/LazyClassMap";

class SiteConfig {
    public readonly title: string = "JaPNaA";
    public readonly id: number = Math.random();

    public readonly path = {
        base: "",

        img: {
            hexagon: "assets/img/hexagon.svg",
            logo: "assets/img/japnaa-logo.svg",
            hamburger: "assets/img/hamburger.svg",
            close: "assets/img/close.svg",
            closeWhite: "assets/img/close-white.svg"
        },

        view: {
            overview: "assets/views/overview.html",
            about: "assets/views/about.html"
        },

        thingy: "",

        repo: {
            notRelative: true,
            thingy: "/Thingy/",
            thingy_: "/Thingy_",
            linksIndex: "index.json"
        },

        content: "assets/content/",
        contentIndex: "assets/content/index.json",
        redirectMap: "assets/content/redirects.txt"
    }

    public readonly hexagonsTitle = {
        hexagonsPerLayer: 50,
        layers: 4,
        hexagonsScale: 1.6,
        lowPositionScaleBias: 0.75,
        zoomDistance: 1.2,
        fadeInSpeed: 0.2
    };

    public isHandheld: boolean;
    public isMobile: boolean;
    public isIOS: boolean;

    public connectionIsMetered: boolean;

    private serverTime?: Date;
    private serverTimePromise: Promise<Date>;

    constructor() {
        const base = location.origin + location.pathname;
        this.insertBaseUrl(base, this.path);

        // matches localhost and ips, for debugging
        const match = location.href.match(/^https?:\/\/(((\d+\.){3}\d+)|(localhost)):/);
        if (match) {
            const port = parseInt(location.port);
            if (!isNaN(port)) {
                this.path.thingy = match[0] + (port + 1);
            }
        }

        this.isHandheld = isHandheld();
        this.isMobile = isMobile();
        this.isIOS = isIOS();

        this.connectionIsMetered = connectionIsMetered();

        this.serverTimePromise = getServerTime();
        this.serverTimePromise.then(e => this.serverTime = e);

        if (this.connectionIsMetered) {
            LazyClassMap.stopPrefetches();
        }
    }

    public getServerTime(): Promise<Date> {
        if (this.serverTime) {
            return Promise.resolve(this.serverTime);
        } else {
            return this.serverTimePromise;
        }
    }

    private insertBaseUrl(base: string, obj: { [x: string]: any }) {
        const keys = Object.keys(obj);
        if (obj.notRelative === true) { return; }
        for (const key of keys) {
            if (typeof obj[key] === "string") {
                obj[key] = resolve(base, obj[key]);
            } else if (typeof obj[key] === "object") {
                this.insertBaseUrl(base, obj[key]);
            }
        }
    }
}

const siteConfig = new SiteConfig();

export default siteConfig;
import isHandheld from "./utils/isHandheld";
import isMobile from "./utils/isMobile";
import isIOS from "./utils/isIOS";
import getServerTime from "./utils/getServerTime";
import { resolve } from "url";

class SiteConfig {
    static readonly title: string = "JaPNaA";

    static readonly path = {
        base: "",

        img: {
            hexagon: "assets/img/hexagon.svg",
            logo: "assets/img/japnaa-logo.svg",
            hamburger: "assets/img/hamburger.svg",
            close: "assets/img/close.svg",
            closeWhite: "assets/img/close-white.svg",
            circle: "assets/img/circle.svg"
        },

        view: {
            overview: "assets/views/overview.html"
        },

        thingy: "",

        repo: {
            notRelative: true,
            thingy: "/Thingy/",
            thingy_: "/Thingy_"
        },

        content: "assets/content/",
        contentIndex: "assets/content/index.json"
    }

    static readonly hexagonsTitle = {
        hexagonsPerLayer: 50,
        layers: 4
    };

    static isHandheld: boolean;
    static isMobile: boolean;
    static isIOS: boolean;

    private static serverTime?: Date;
    private static serverTimePromise: Promise<Date>;

    public static setup() {
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

        this.serverTimePromise = getServerTime();
        this.serverTimePromise.then(e => {
            SiteConfig.serverTime = e;
        });
    }

    public static getServerTime(): Promise<Date> {
        if (this.serverTime) {
            return Promise.resolve(this.serverTime);
        } else {
            return this.serverTimePromise;
        }
    }

    private static insertBaseUrl(base: string, obj: { [x: string]: any }) {
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

export default SiteConfig;
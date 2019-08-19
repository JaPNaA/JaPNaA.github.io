import isHandheld from "./utils/isHandheld";
import isMobile from "./utils/isMobile";
import isIOS from "./utils/isIOS";
import getServerTime from "./utils/getServerTime";
import { resolve } from "url";
import connectionIsMetered from "./utils/connectionIsMetered";
import LazyClassMap from "./core/components/lazyClassMap/LazyClassMap";
import SiteSettings from "./SiteSettings";
import EventHandlers from "./core/utils/events/EventHandlers";
import Handler from "./core/utils/events/Handler";

class SiteConfig {
    public readonly title: string = "JaPNaA";

    public readonly path = {
        base: "",

        img: {
            hexagon: "assets/img/hexagon.svg",
            logo: "assets/img/japnaa-logo.svg",
            hamburger: "assets/img/hamburger.svg",
            close: "assets/img/close.svg",
            closeWhite: "assets/img/close-white.svg"
        },

        theme: {
            dark: "bundles/darkTheme.css"
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

    public readonly localStorageSettingsKey = "JaPNaASiteSettings";
    public settings = new SiteSettings();

    public readonly hexagonBaseHue = 149;

    public isHandheld: boolean;
    public isMobile: boolean;
    public isIOS: boolean;

    public connectionIsMetered: boolean;

    private serverTime?: Date;
    private serverTimePromise: Promise<Date>;
    private settingsChangeHandlers: EventHandlers;

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

        this.settingsChangeHandlers = new EventHandlers();

        if (this.connectionIsMetered) {
            LazyClassMap.stopPrefetches();
        }

        this.restoreSettingsFromLocalStorage();
    }

    public getServerTime(): Promise<Date> {
        if (this.serverTime) {
            return Promise.resolve(this.serverTime);
        } else {
            return this.serverTimePromise;
        }
    }

    public onSettingsChanged(handler: Handler): void {
        this.settingsChangeHandlers.add(handler);
    }

    public offSettingsChanged(handler: Handler): void {
        this.settingsChangeHandlers.remove(handler);
    }

    public _dispatchSettingsChanged(): void {
        this.saveSettingsToLocalStorage();
        this.settingsChangeHandlers.dispatch();
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

    private saveSettingsToLocalStorage(): void {
        localStorage[this.localStorageSettingsKey] = JSON.stringify(this.settings);
    }

    private restoreSettingsFromLocalStorage(): void {
        const storedStr = localStorage[this.localStorageSettingsKey];
        if (!storedStr) { return; }

        let storedConfig;
        try {
            storedConfig = JSON.parse(storedStr);
        } catch (err) {
            console.warn("Error while parsing localstorage; value ignored", err);
            return;
        }

        this.restoreSettings(this.settings, storedConfig);
    }

    private restoreSettings(thisObj: any, otherObj: any): void {
        const keys = Object.keys(thisObj);

        for (const key of keys) {
            if (typeof thisObj[key] !== typeof otherObj[key]) { continue; }
            if (typeof otherObj[key] !== "object") {
                thisObj[key] = otherObj[key];
            } else {
                this.restoreSettings(thisObj[key], otherObj[key]);
            }
        }
    }
}

const siteConfig = new SiteConfig();

export default siteConfig;
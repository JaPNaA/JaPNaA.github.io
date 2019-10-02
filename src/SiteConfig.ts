import EventHandlers from "./core/utils/events/EventHandlers";
import Handler from "./core/utils/events/Handler";
import LazyClassMap from "./core/components/lazyClassMap/LazyClassMap";
import SiteSettings from "./SiteSettings";
import connectionIsMetered from "./utils/isClient/connectionIsMetered";
import getServerTime from "./utils/getServerTime";
import isEdge from "./utils/isClient/isEdge";
import isHandheld from "./utils/isClient/isHandheld";
import isIE from "./utils/isClient/isIE";
import isIOS from "./utils/isClient/isIOS";
import isMobile from "./utils/isClient/isMobile";
import { resolve } from "url";
import getBasePath from "./utils/getBasePath";

class SiteConfig {
    public readonly title: string = "JaPNaA";
    public readonly viewStateSeparator = "?"; // could also be '/' or '#', if willing to sacrifice SEO

    public readonly developmentMode: boolean;

    public readonly path = {
        /** With / at end */
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
            /** With / at end */
            thingy: "/Thingy/",
            /** Requires #year after, no / */
            thingy_: "/Thingy_",
            linksIndex: "index.json"
        },

        content: "assets/content/",
        contentIndex: "assets/content/index.json",
        redirectMap: "assets/content/redirects.txt"
    }

    public readonly hexagons = {
        hexagonsPerLayer: 50,
        layers: 4,
        hexagonsSize: 0.32,
        minHexagonSize: 0.4,
        layerSizeFactor: 0.22,
        positionScaleBias: 1,
        zoomDistance: 1.2,
        fadeInSpeed: 0.2,
        parallaxIntensity: 0.5
    };

    public readonly cssVars = {
        heroTransitionInTime: 800,
        longTextContainerMaxWidth: 768,
        stickyBarHeight: 72
    };

    public readonly localStorageSettingsKey = "JaPNaASiteSettings";
    public settings = new SiteSettings();

    public readonly isHandheld: boolean;
    public readonly isMobile: boolean;
    public readonly isIOS: boolean;
    public readonly isEdge: boolean;
    public readonly isIE: boolean;

    public readonly connectionIsMetered: boolean;

    private serverTime?: Date;
    private serverTimePromise: Promise<Date>;
    private settingsChangeHandlers: EventHandlers;

    constructor() {
        const base = getBasePath();
        this.insertBaseUrl(base, this.path);

        // matches localhost and IPs, for debugging
        const match = location.href.match(/^https?:\/\/(((\d+\.){3}\d+)|(localhost)):/);
        if (match) {
            const port = parseInt(location.port);
            if (!isNaN(port)) {
                this.path.thingy = match[0] + (port + 1);
            }
        } else if (location.hostname !== 'localhost') {
            // if hosted somewhere else, (staging url)
            this.path.thingy = "https://japnaa.github.io/";
        }

        this.developmentMode = Boolean(match);

        this.isHandheld = isHandheld();
        this.isMobile = isMobile();
        this.isIOS = isIOS();
        this.isEdge = isEdge();
        this.isIE = isIE();

        this.connectionIsMetered = connectionIsMetered();

        this.serverTimePromise = getServerTime();
        this.serverTimePromise.then(e => this.serverTime = e);

        this.settingsChangeHandlers = new EventHandlers();

        this.resetPrefetchStatus();
        this.restoreSettingsFromLocalStorage();
    }

    public getServerTime(): Promise<Date> {
        if (this.serverTime) {
            return Promise.resolve(this.serverTime);
        } else {
            return this.serverTimePromise;
        }
    }

    public resetPrefetchStatus(): void {
        if (this.connectionIsMetered) {
            LazyClassMap.stopPrefetches();
        } else {
            LazyClassMap.continuePrefetches();
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
console.log(siteConfig);

export default siteConfig;
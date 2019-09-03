import loadPromisePolyfill from "./polyfills/loadPromisePolyfill";
import applyPolyfills from "./polyfills/polyfills";
import getBasePath from "./utils/getBasePath";

// @ts-ignore
__webpack_public_path__ = getBasePath() + "bundles/";

loadPromisePolyfill(() => applyPolyfills().then(async () => {
    const App = (await import("./App")).default;
    const app = new App();
    app.setup();

    console.log(app);
}));
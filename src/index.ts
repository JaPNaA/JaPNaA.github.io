import loadPromisePolyfill from "./polyfills/loadPromisePolyfill";
import applyPolyfills from "./polyfills/polyfills";

// @ts-ignore
__webpack_public_path__ = location.origin + location.pathname + "bundles/";

loadPromisePolyfill(() => applyPolyfills().then(async e => {
    const App = (await import("./App")).default;
    const app = new App();
    app.setup();

    console.log(app);
}));
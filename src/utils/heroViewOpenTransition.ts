import ViewDescriptor from "../core/types/app/ViewDescriptor";
import AppState from "../core/types/AppState";
import wait from "./wait";
import IApp from "../core/types/app/IApp";
import siteResources from "../core/siteResources";
import ViewMap from "../core/view/ViewMap";
import ViewClass from "../core/types/view/ViewClass";
import createAppState from "../core/utils/createAppState";
import View from "../core/view/View";
import siteConfig from "../SiteConfig";

/**
 * Zoom in on an element and open a view
 * @param app app to open view in
 * @param zoomTargetElm element to zoom in on
 * @param transitionTime how long the transition is
 * @param viewDescriptor a view class or view name of the new view being opened
 * @param newViewState the state of the new view
 * @param fadeInNewViewFn an async function to make the new view fade in
 */
export default function heroViewOpenTransition<T extends View>(
    app: IApp,
    zoomTargetElm: HTMLElement,
    viewDescriptor: ViewDescriptor,
    newViewState: string | AppState,
    fadeInNewViewFn: (view: T) => Promise<void>
) {
    fixElementPosition(zoomTargetElm);

    requestAnimationFrame(() => requestAnimationFrame(async () => {
        const cssTransitionEnd = wait(siteConfig.cssVars.heroTransitionInTime);

        resetElementPosition(zoomTargetElm);
        zoomTargetElm.classList.add("heroTransitionIn");

        const viewClass = await getViewClassFromDescriptor(viewDescriptor);
        const view = await createView(app, viewClass, newViewState);
        view.setup();

        await siteResources.nextDone();
        await cssTransitionEnd;

        app.views.add(view);
        fadeInNewViewFn(view as T).then(() =>
            app.views.closeAllViewsExcept(view)
        );
    }));
}

function fixElementPosition(elm: HTMLElement) {
    const bbox = elm.getBoundingClientRect();

    elm.style.position = "fixed";
    elm.style.top = bbox.top + "px";
    elm.style.left = bbox.left + "px";
    elm.style.width = bbox.width + "px";
    elm.style.height = bbox.height + "px";
}

function resetElementPosition(elm: HTMLElement) {
    elm.style.top = "";
    elm.style.left = "";
    elm.style.width = "";
    elm.style.height = "";
}

async function getViewClassFromDescriptor(descriptor: ViewDescriptor): Promise<ViewClass> {
    if (typeof descriptor === "string") {
        return ViewMap.get(descriptor);
    } else {
        return descriptor;
    }
}

async function createView(app: IApp, viewClass: ViewClass, state?: string | AppState): Promise<View> {
    if (typeof state === "string" || typeof state === "undefined") {
        return new viewClass(app, createAppState(viewClass, state));
    } else {
        return new viewClass(app, state);
    }
}
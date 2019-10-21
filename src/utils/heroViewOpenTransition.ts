import ViewDescriptor from "../core/types/view/ViewDescriptor";
import AppState from "../core/types/AppState";
import wait from "./wait";
import IApp from "../core/types/app/IApp";
import siteResources from "../core/siteResources";
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
    css: any,
    zoomTargetElm: HTMLElement,
    viewDescriptor: ViewDescriptor,
    newViewState: string | AppState,
    fadeInNewViewFn: (view: T) => Promise<void>
) {
    fixElementPosition(zoomTargetElm);

    requestAnimationFrame(() => requestAnimationFrame(async () => {
        const cssTransitionEnd = wait(siteConfig.cssVars.heroTransitionInTime);

        resetElementPosition(zoomTargetElm);
        zoomTargetElm.classList.add(css.heroTransitionIn);

        const viewWithFallbackStatus = await app.views.createAndSetupViewWithFallbacks(viewDescriptor, newViewState);

        await siteResources.nextDone();
        await cssTransitionEnd;

        app.views.add(viewWithFallbackStatus.view);

        if (!viewWithFallbackStatus.isFallback) {
            fadeInNewViewFn(viewWithFallbackStatus.view as T).then(() =>
                app.views.closeAllViewsExcept(viewWithFallbackStatus.view)
            );
        }
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

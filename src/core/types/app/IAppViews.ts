import View from "../../view/View";
import ViewClass from "../view/ViewClass";
import ViewMetadata from "../view/ViewMetadata";
import AppState from "../AppState";

export default interface IAppViews {
    top(): View | undefined;
    firstFullTop(): View | undefined;
    switchAndInit(viewClass: ViewClass | string, stateData?: string | AppState): Promise<View>;
    open(viewClass: ViewClass | string, stateData?: string | AppState): Promise<View>;
    openBehind(viewClass: ViewClass | string, stateData?: string | AppState): Promise<View>;
    switch(view: View): void;
    addBehind(view: View): void;
    add(view: View): void;
    closeAllViews(): void;
    closeAllViewsExcept(view: View): void;
    close(view: View): void;
    getA(view: ViewMetadata | string): View | undefined;
}
import View from "../../view/View";
import ViewMetadata from "../view/ViewMetadata";
import AppState from "../AppState";
import ViewDescriptor from "../view/ViewDescriptor";
import ViewWithFallbackStatus from "../view/ViewWithFallbackStatus";
import BeforeSetupCallback from "../BeforeSetupCallback";

export default interface IAppViews {
    top(): View | undefined;
    firstFullTop(): View | undefined;
    getA(view: ViewMetadata | string): View | undefined;
    getById(id: number): View | undefined;

    switchAndInit<T extends View>(viewClass: ViewDescriptor, stateData?: string | AppState, beforeSetupCallback?: BeforeSetupCallback<T>): Promise<View>;
    open<T extends View>(viewClass: ViewDescriptor, stateData?: string | AppState, beforeSetupCallback?: BeforeSetupCallback<T>): Promise<View>;
    openBehind<T extends View>(viewClass: ViewDescriptor, stateData?: string | AppState, beforeSetupCallback?: BeforeSetupCallback<T>): Promise<View>;

    createAndSetupViewWithFallbacks<T extends View>(viewDescriptor: ViewDescriptor, stateData?: string | AppState, beforeSetupCallback?: BeforeSetupCallback<T>): Promise<ViewWithFallbackStatus>
    createViewWithFallbacks(viewDescriptor: ViewDescriptor, stateData?: string | AppState): Promise<ViewWithFallbackStatus>
    createView(viewDescriptor: ViewDescriptor, stateData?: string | AppState): Promise<View>

    switch(view: View): void;
    addBehind(view: View): void;
    add(view: View): void;

    closeAllViews(): void;
    closeAllViewsExcept(view: View): void;
    close(view: View): void;
}


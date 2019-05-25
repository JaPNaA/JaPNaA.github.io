import View from "../../view/view";
import ViewClass from "../view/viewClass";
import ViewMetadata from "../view/viewMetadata";
import ViewClassGhost from "../../view/viewClassGhost";
import AppState from "../appState";

export default interface IAppViews {
    top(): View | undefined;
    firstFullTop(): View | undefined;
    switchAndInit(viewClass: ViewClass | ViewClassGhost | string, stateData?: string | AppState): Promise<View>;
    open(viewClass: ViewClass | ViewClassGhost | string, stateData?: string | AppState): Promise<View>;
    openBehind(viewClass: ViewClass | ViewClassGhost | string, stateData?: string | AppState): Promise<View>;
    switch(view: View): void;
    addBehind(view: View): void;
    add(view: View): void;
    close(view: View): void;
    getA(view: ViewMetadata | string): View | undefined;
}
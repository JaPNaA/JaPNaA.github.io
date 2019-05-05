import View from "../../elm/views/view";
import ViewClass from "../viewClass";

export default interface IAppViews {
    top(): View | undefined;
    firstFullTop(): View | undefined;
    switchAndInit(viewClass: ViewClass, stateData?: string): View;
    open(viewClass: ViewClass, stateData?: string): View;
    openBehind(viewClass: ViewClass, stateData?: string): View;
    switch(view: View): void;
    addBehind(view: View): void;
    add(view: View): void;
    close(view: View): void;
    getA(viwe: ViewClass): View | undefined;
}
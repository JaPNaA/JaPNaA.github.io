import View from "../../elm/views/view";
import ViewClass from "../viewClass";

export default interface IAppViews {
    top(): View | undefined;
    switchAndInit(viewClass: ViewClass): View;
    switch(view: View): void;
    open(viewClass: ViewClass): View;
    openBehind(viewClass: ViewClass): View;
    addBehind(view: View): void;
    add(view: View): void;
    close(view: View): void;
}
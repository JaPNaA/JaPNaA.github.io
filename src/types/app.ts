import ViewClass from "./ViewClass";
import View from "../elm/views/view";
import Handler from "../utils/events/handler";

interface IApp {
    setup(): Promise<void>;
    getTopView(): View | undefined;
    switchAndInitView(viewClass: ViewClass): void;
    switchView(view: View): void;
    openView(viewClass: ViewClass): View;
    openViewBehind(viewClass: ViewClass): View;
    addViewBehind(view: View): void;
    addView(view: View): void;
    closeView(view: View): void;
    onViewChange(handler: Handler): void;
    offViewChange(handler: Handler): void;
}

export default IApp;
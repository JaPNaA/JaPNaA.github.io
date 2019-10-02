import IApp from "../../../core/types/app/IApp";
import ViewDescriptor from "../../../core/types/view/ViewDescriptor";
import AppState from "../../../core/types/AppState";
import BeforeSetupCallback from "../../../core/types/BeforeSetupCallback";
import View from "../../../core/view/View";

class GlobalKeybindings {
    private app: IApp;
    private bindings: { [x: number]: () => void } = {
        191: () => this.openIfNot("CommandPalette", "/"),
        80: () => this.openIfNot("CommandPalette")
    };

    private shiftBindings: { [x: number]: () => void } = {
        51: () => this.openIfNot("CommandPalette", "#")
    };

    constructor(app: IApp) {
        this.app = app;
    }

    public setup(): void {
        this.keydownHandler = this.keydownHandler.bind(this);
        this.app.events.onKeydown(this.keydownHandler);
    }

    public destory(): void {
        this.app.events.offKeydown(this.keydownHandler);
    }

    private keydownHandler(e: KeyboardEvent): void {
        if (
            e.target instanceof HTMLElement &&
            e.target.tagName === "INPUT"
        ) { return; }

        if (e.shiftKey) {
            const fn = this.shiftBindings[e.keyCode];
            if (fn) { fn(); }
        } else {
            const fn = this.bindings[e.keyCode];
            if (fn) { fn(); }
        }
    }

    private openIfNot(viewClass: ViewDescriptor, stateData?: string | AppState, beforeSetupCallback?: BeforeSetupCallback<View>): void {
        if (this.app.views.getA(viewClass)) { return; }
        this.app.views.open(viewClass, stateData, beforeSetupCallback);
    }
}

export default GlobalKeybindings;
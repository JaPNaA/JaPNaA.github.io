import "../../../../styles/views/widgetView.less";

import View from "../../../core/view/view";
import ViewMap from "../../../core/view/viewMap";
import IApp from "../../../core/types/app/iApp";
import AppState from "../../../core/types/appState";
import WidgetMap from "../../../core/widget/widgetMap";
import WidgetClass from "../../../core/types/widget/widgetClass";
import WidgetFactory from "../../../core/widget/widgetFactory";
import Widget from "../../../core/widget/widget";

/**
 * A view for debugging and testing widgets
 * 
 * To use, navigate to:
 * /widget:${widgetName}/${arguments.join("#")?}<<${evalCode: (widget) => void?}
 * 
 * Use $app as an argument to pass the `app: IApp` argument to the widget
 * 
 * The Widget.setup() function is called automatically
 */
class WidgetView extends View {
    public static viewName = "WidgetView";
    public static viewMatcher = /^widget:.+/;
    public viewName = WidgetView.viewName;
    public showMenuButton = false;

    protected elm: HTMLElement;

    private widgetName: string;
    private argsString: string[];
    private evalString?: string;
    private widget?: Widget;

    constructor(app: IApp, state: AppState) {
        super(app);
        this.elm = document.createElement("div");

        if (state.stateData) {
            const [argsString, evalString] = state.stateData.split("<<");
            this.argsString = argsString.split("#");
            this.evalString = evalString;
        } else {
            this.argsString = [];
        }

        this.widgetName = this.getWidgetName(state.viewName);
    }

    public async setup(): Promise<void> {
        await super.setup();
        WidgetMap.get(this.widgetName)
            .then(widgetClass => this.setupWidget(widgetClass))
            .catch(err => this.writeError(err));
    }

    public async destory(): Promise<void> {
        await super.destory();
        if (this.widget) {
            this.widget.destory();
        }
    }

    private async setupWidget(widgetClass: WidgetClass): Promise<void> {
        const args = [];
        for (const argString of this.argsString) {
            if (argString === "$app") {
                args.push(this.app);
            } else {
                args.push(argString);
            }
        }
        this.widget = await WidgetFactory.create(widgetClass, args);
        this.widget.appendTo(this.elm);

        if (this.evalString) {
            const fn = new Function("widget", this.evalString);
            fn(this.widget);
        }
    }

    private writeError(err: Error): void {
        const pre = document.createElement("pre");
        pre.innerText = err.stack || err.message;
        this.elm.appendChild(pre);
    }

    private getWidgetName(str: string): string {
        return str.slice(str.indexOf(":") + 1);
    }
}

ViewMap.add(WidgetView);

export default WidgetView;
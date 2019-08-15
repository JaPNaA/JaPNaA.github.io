import "../../../../styles/widgets/settings.less";

import Widget from "../../../core/widget/Widget";
import WidgetMap from "../../../core/widget/WidgetMap";
import SettingsEditor from "./SettingsEditor";

class SettingsWidget<T> extends Widget {
    public static widgetName = "settings";
    public widgetName = SettingsWidget.widgetName;

    protected elm: Element;

    private obj: any;
    private editor: SettingsEditor<T>;

    constructor(settingsObj: T) {
        super();
        this.elm = document.createElement("div");
        this.editor = new SettingsEditor("Settings", settingsObj);
        this.obj = settingsObj;
    }

    public setup() {
        super.setup();
        this.editor.appendTo(this.elm);
    }
}

WidgetMap.add(SettingsWidget);

export default SettingsWidget;
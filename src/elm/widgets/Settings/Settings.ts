import "../../../../styles/widgets/settings.less";

import Widget from "../../../core/widget/Widget";
import WidgetMap from "../../../core/widget/WidgetMap";
import SettingsEditor from "./SettingsEditor";
import SiteSettings from "../../../SiteSettings";
import siteConfig from "../../../SiteConfig";

class SiteSettingsWidget extends Widget {
    public static widgetName = "settings";
    public widgetName = SiteSettingsWidget.widgetName;

    protected elm: Element;

    private editor: SettingsEditor<SiteSettings>;

    constructor() {
        super();
        this.elm = document.createElement("div");
        this.editor = new SettingsEditor("Settings", siteConfig.settings);
    }

    public setup(): void {
        super.setup();
        this.editor.onChange(this.settingsChangeHandler);
        this.editor.appendTo(this.elm);
    }

    private settingsChangeHandler(): void {
        siteConfig._dispatchSettingsChanged();
    }
}

WidgetMap.add(SiteSettingsWidget);

export default SiteSettingsWidget;
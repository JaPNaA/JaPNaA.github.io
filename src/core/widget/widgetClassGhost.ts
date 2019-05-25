import WidgetClass from "../types/widget/widgetClass";
import Widget from "./widget";
import ClassGhost from "../components/classGhost/classGhost";
import ClassImporterFunction from "../types/classImporterFunction";

class WidgetClassGhost extends ClassGhost<Widget, WidgetClass> {
    public widgetName: string;

    constructor(widgetName: string, defaultClassImporter: ClassImporterFunction<WidgetClass>) {
        super(widgetName, defaultClassImporter);
        this.widgetName = widgetName;
    }

    public async create(...args: any[]): Promise<Widget> {
        return new (await this.importer()).default(...args);
    }
}

export default WidgetClassGhost;
import SiteResources from "../../siteResources";
import ClassImporterFunction from "../../types/classImporterFunction";

abstract class ClassGhost<T, TClass> {
    public className: string;
    public importer: ClassImporterFunction<TClass>;

    constructor(className: string, defaultClassImporter: ClassImporterFunction<TClass>) {
        this.className = className;
        this.importer = defaultClassImporter;
    }

    public async getClass(): Promise<TClass> {
        console.log("Loading class " + this.className);
        SiteResources.addResourceLoading();
        const cls = (await this.importer()).default;
        SiteResources.addResourceLoaded();
        return cls;
    }

    public abstract create(...args: any[]): Promise<T>;
}

export default ClassGhost;
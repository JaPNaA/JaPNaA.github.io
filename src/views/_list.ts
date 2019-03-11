import ViewClass from "../types/ViewClass";

class ViewMap {
    private static viewMap = new Map<string, ViewClass>();
    
    public static add(viewClass: ViewClass): void {
        this.viewMap.set(viewClass.viewName.toLowerCase(), viewClass);
    }

    public static get(viewName: string): ViewClass | undefined {
        return this.viewMap.get(viewName.toLowerCase());
    }
}

export default ViewMap;
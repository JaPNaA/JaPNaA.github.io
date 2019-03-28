import AppEvents from "./events";
import IAppURL from "../../types/app/iAppURL";

class AppURL implements IAppURL {
    public restoredFromRedirect: boolean = false;
    private isFake: boolean = false;

    constructor(appEvents: AppEvents) {
        //
    }

    public setFake() {
        this.isFake = true;
    }

    public restoreIfShould(arg0: any): any {
        if (this.isFake) { return; }
        console.error("restore if should not impelemented")
    }

    public setState() {
        if (this.isFake) { return; }
        console.error("set state not implemented");
    }

    public pushState() {
        if (this.isFake) { return; }
        console.error("push state not implemented");
    }
}

export default AppURL;
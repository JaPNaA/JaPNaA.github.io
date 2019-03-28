import IURLMan from "./iUrlMan";
import App from "../../app/app";

class FakeURLMan implements IURLMan {
    public restoredFromRedirect: boolean = false;
    public setState(viewName: string, viewStateData?: string | undefined): void { }
    public pushState(viewName: string, viewStateData?: string | undefined): void { }
    public restoreIfShould(app: App): void { }
    public clearState(): void { }
}

export default FakeURLMan;
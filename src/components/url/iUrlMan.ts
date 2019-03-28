import App from "../../app/app";

interface IURLMan {
    restoredFromRedirect: boolean;
    setState(viewName: string, viewStateData ?: string): void;
    pushState(viewName: string, viewStateData ?: string): void;
    restoreIfShould(app: App): void;
    clearState(): void;
}

export default IURLMan;
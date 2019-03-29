import View from "../../elm/views/view";

export default interface IAppURL {
    register(view: View): void;
    unregister(view: View): void;
    update(): void;
}
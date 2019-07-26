import IAppURL from "../../types/app/IAppURL";

class FakeURL implements IAppURL {
    public pushHistory(): void {}
    public updateViewIfIsCurrent(): void { }
    public update(): void { }
}

export default FakeURL;
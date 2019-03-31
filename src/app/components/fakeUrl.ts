import IAppURL from "../../types/app/iAppURL";

class FakeURL implements IAppURL {
    public pushHistory(): void {}
    public update(): void { }
}

export default FakeURL;
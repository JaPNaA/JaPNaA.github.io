abstract class ViewComponent {
    public abstract setup(): void;
    public abstract destory(): void;
    public abstract updatePrivateData(): void;
}

export default ViewComponent;
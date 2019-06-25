import IApp from "../core/types/app/IApp";
import IFrameView from "../elm/views/FrameView/IFrameView";

export default async function openFrameView(app: IApp, href: string): Promise<IFrameView> {
    const frameView = await app.views.open("FrameView", href) as IFrameView;
    frameView.animateTransitionIn();
    return frameView;
}
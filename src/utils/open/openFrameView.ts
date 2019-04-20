import IApp from "../../types/app/iApp";
import FrameView from "../../elm/views/views/frameView";

export default function openFrameView(app: IApp, href: string): FrameView {
    const frameView = new FrameView(app, href);
    frameView.preventRedirection();
    frameView.animateTransitionIn();
    frameView.setup();
    app.views.add(frameView);
    return frameView;
}
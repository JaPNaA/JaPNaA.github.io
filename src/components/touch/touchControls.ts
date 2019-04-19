import { Vec2, newVec2 } from "../../types/math/vec2";
import EventHandlers from "../../utils/events/eventHandlers";
import Handler from "../../utils/events/handler";
import getDist from "../../utils/math/getDist";

class TouchControls {
    private elm: HTMLElement;
    private touchMap: Map<number, Vec2>;

    private singleTapPos: Vec2;
    private singleTapped: boolean;
    private touchMoved: boolean;

    private moveHandlers: EventHandlers<Vec2>;
    private startMoveHandlers: EventHandlers;
    private endMoveHandlers: EventHandlers;
    private zoomHandlers: EventHandlers<[number, Vec2]>;
    private tapHandlers: EventHandlers<Vec2>;
    private doubleTapHandlers: EventHandlers<Vec2>;

    constructor(elm: HTMLElement) {
        this.elm = elm;
        this.touchMap = new Map();
        this.singleTapped = false;
        this.singleTapPos = newVec2();
        this.touchMoved = false;

        this.moveHandlers = new EventHandlers();
        this.startMoveHandlers = new EventHandlers();
        this.endMoveHandlers = new EventHandlers();
        this.zoomHandlers = new EventHandlers();
        this.tapHandlers = new EventHandlers();
        this.doubleTapHandlers = new EventHandlers();
    }

    public setup(): void {
        this.addEventHandlers();
        //
    }

    public destory(): void {
        this.removeEventHandlers();
    }

    public onMove(handler: Handler<Vec2>): void {
        this.moveHandlers.add(handler);
    }

    public onStartMove(handler: Handler): void {
        this.startMoveHandlers.add(handler);
    }

    public onEndMove(handler: Handler): void {
        this.endMoveHandlers.add(handler);
    }

    public onZoom(handler: Handler<[number, Vec2]>): void {
        this.zoomHandlers.add(handler);
    }

    public onDoubleTap(handler: Handler<Vec2>): void {
        this.doubleTapHandlers.add(handler);
    }

    public onTap(handler: Handler<Vec2>): void {
        this.tapHandlers.add(handler);
    }

    private addEventHandlers(): void {
        this.touchStartHandler = this.touchStartHandler.bind(this);
        this.elm.addEventListener("touchstart", this.touchStartHandler);

        this.touchEndHandler = this.touchEndHandler.bind(this);
        this.elm.addEventListener("touchend", this.touchEndHandler.bind(this));

        this.touchMoveHandler = this.touchMoveHandler.bind(this);
        this.elm.addEventListener("touchmove", this.touchMoveHandler.bind(this));
    }

    private removeEventHandlers() {
        this.elm.removeEventListener("touchstart", this.touchStartHandler);
        this.elm.removeEventListener("touchend", this.touchEndHandler);
        this.elm.removeEventListener("touchmove", this.touchMoveHandler);
    }

    private touchStartHandler(e: TouchEvent): void {
        if (e.cancelable) { e.preventDefault(); }

        if (this.touchMap.size === 0) {
            this.startMoveHandlers.dispatch();
            this.touchMoved = false;
        }

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.touchMap.set(touch.identifier, newVec2(touch.clientX, touch.clientY));
        }
    }

    private touchEndHandler(e: TouchEvent): void {
        if (e.cancelable) { e.preventDefault(); }

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            this.touchMap.delete(touch.identifier);
        }

        if (this.touchMap.size === 0) {
            this.endMoveHandlers.dispatch();
            if (!this.touchMoved) {
                const touch = e.changedTouches[0];
                const touchVec = newVec2(touch.clientX, touch.clientY);

                if (this.singleTapped) {
                    this.doubleTapHandlers.dispatch(touchVec);
                    this.singleTapped = false;
                } else {
                    this.singleTapPos = touchVec;
                    this.singleTapped = true;
                }

                this.tapHandlers.dispatch(touchVec);
            }
        }
    }

    private touchMoveHandler(e: TouchEvent): void {
        if (e.cancelable) { e.preventDefault(); }

        let pinching = false;

        if (e.touches.length >= 2) {
            this.checkZoom(e.touches[0], e.touches[1]);
            pinching = true;
        }

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const oldPos = this.touchMap.get(touch.identifier) as Vec2;

            if (!pinching) {
                this.moveHandlers.dispatch(newVec2(
                    touch.clientX - oldPos.x, touch.clientY - oldPos.y
                ));
            }

            this.touchMap.set(touch.identifier, newVec2(touch.clientX, touch.clientY));
        }

        this.touchMoved = true;
    }

    private checkZoom(touchA: Touch, touchB: Touch): void {
        const prevA = this.touchMap.get(touchA.identifier) as Vec2;
        const prevB = this.touchMap.get(touchB.identifier) as Vec2;

        const currDist = getDist(touchA.clientX - touchB.clientX, touchA.clientY - touchB.clientY);
        const prevDist = getDist(prevA.x - prevB.x, prevA.y - prevB.y);
        const centerX = (touchA.clientX + touchB.clientX) / 2;
        const centerY = (touchA.clientY + touchB.clientY) / 2;

        this.zoomHandlers.dispatch([currDist / prevDist, newVec2(centerX, centerY)]);
    }
}

export default TouchControls;
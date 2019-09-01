export default function apply() {
    CanvasRenderingContext2D.prototype.resetTransform = function() {
        this.setTransform(1, 0, 0, 1, 0, 0);
    };
};

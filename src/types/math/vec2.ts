export interface Vec2 {
    x: number;
    y: number;
};

function newVec2(): Vec2;
function newVec2(x?: number, y?: number): Vec2 {
    return { x: x || 0, y: y || 0 };
}

export { newVec2 };
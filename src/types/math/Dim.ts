export interface Dim {
    width: number;
    height: number;
};

function createDim(): Dim;
function createDim(w?: number, h?: number): Dim {
    return { width: w || 0, height: h || 0 };
};

export { createDim };
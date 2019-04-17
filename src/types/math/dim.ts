export interface Dim {
    width: number;
    height: number;
};

function newDim(): Dim;
function newDim(w?: number, h?: number): Dim {
    return { width: w || 0, height: h || 0 };
};

export { newDim };
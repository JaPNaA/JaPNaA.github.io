import Hexagon from "./Hexagon";

type HexagonType = new (z: number) => Hexagon;

export default HexagonType;
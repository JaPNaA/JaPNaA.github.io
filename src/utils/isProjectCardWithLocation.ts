import ICardWithLocation from "../components/contentMan/ICardWithLocation";
import isProjectCard from "./isProjectCard";

export default function isProjectCardWithLocation(x: any): x is ICardWithLocation {
    return x && typeof x.year === "number" && typeof x.index === "number" && isProjectCard(x.project);
}
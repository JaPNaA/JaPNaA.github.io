import IWithLocation from "../components/contentMan/IWithLocation";

export default function isWithLocation(x: any): x is IWithLocation<any> {
    return x && typeof x.year === "number" && typeof x.index === "number" && x.project;
}
import IProjectLink from "../components/contentMan/IProjectLink";

export default function isProjectLink(x: any): x is IProjectLink {
    return x && typeof x.name === "string" && typeof x.href === "string";
}
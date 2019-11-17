export default function getBasePath(): string {
    return location.protocol + "//" + location.host + "/";
}
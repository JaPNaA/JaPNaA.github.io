export default function getBasePath(): string {
    return location.protocol + "//" + location.host +
        location.pathname.slice(0, location.pathname.lastIndexOf("/") + 1);
}
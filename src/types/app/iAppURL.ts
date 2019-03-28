export default interface IAppURL {
    pushState(...x: string[]): any;
    setState(...x: string[]): void;
}
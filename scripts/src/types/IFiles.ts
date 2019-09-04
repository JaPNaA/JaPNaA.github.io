export default interface IFiles {
    parse(): Promise<void>;
    writeOut(): Promise<void>
}
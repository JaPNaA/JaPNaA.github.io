import LinkHandlingOptions from "./linkHandlingOptions";

export default interface HTMLViewParserOptions extends LinkHandlingOptions {
    scripts?: boolean,
    inlineJS?: boolean
};;
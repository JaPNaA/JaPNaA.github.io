import V2FormatParser from "./v2FormatParser/V2FormatParser";
import IndexJSONUpdater from "./indexJSONUpdater/IndexJSONUpdater";

export default async function runScripts() {
    await new V2FormatParser().parse();
    await new IndexJSONUpdater().update();
}

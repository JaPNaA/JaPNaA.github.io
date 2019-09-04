import ContentParser from "./ContentParser";

export default async function main() {
    await new ContentParser().parseAndWrite();
}
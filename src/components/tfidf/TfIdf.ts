class TfIdf<T extends number | string> {
    private static isStopWordMap: { [x: string]: boolean } = { "a": true, "about": true, "above": true, "after": true, "again": true, "against": true, "all": true, "am": true, "an": true, "and": true, "any": true, "are": true, "as": true, "at": true, "be": true, "because": true, "been": true, "before": true, "being": true, "below": true, "between": true, "both": true, "but": true, "by": true, "can": true, "did": true, "do": true, "does": true, "doing": true, "don": true, "down": true, "during": true, "each": true, "few": true, "for": true, "from": true, "further": true, "had": true, "has": true, "have": true, "having": true, "he": true, "her": true, "here": true, "hers": true, "herself": true, "him": true, "himself": true, "his": true, "how": true, "i": true, "if": true, "in": true, "into": true, "is": true, "it": true, "its": true, "itself": true, "just": true, "me": true, "more": true, "most": true, "my": true, "myself": true, "no": true, "nor": true, "not": true, "now": true, "of": true, "off": true, "on": true, "once": true, "only": true, "or": true, "other": true, "our": true, "ours": true, "ourselves": true, "out": true, "over": true, "own": true, "s": true, "same": true, "she": true, "should": true, "so": true, "some": true, "such": true, "t": true, "than": true, "that": true, "the": true, "their": true, "theirs": true, "them": true, "themselves": true, "then": true, "there": true, "these": true, "they": true, "this": true, "those": true, "through": true, "to": true, "too": true, "under": true, "until": true, "up": true, "very": true, "was": true, "we": true, "were": true, "what": true, "when": true, "where": true, "which": true, "while": true, "who": true, "whom": true, "why": true, "will": true, "with": true, "you": true, "your": true, "yours": true, "yourself": true, "yourselves": true };
    private allWords: Map<string, number>;
    private documents: [T, Map<string, number>][];

    constructor() {
        this.documents = [];
        this.allWords = new Map();
    }

    public addDocument(id: T, documents: [number, string | string[]][]): Map<string, number> {
        const map: Map<string, number> = new Map();

        for (const [weight, tokens] of documents) {
            let tokensArr;
            if (Array.isArray(tokens)) {
                tokensArr = tokens;
            } else {
                tokensArr = tokens.toLowerCase().split(/[^a-z]/g);
            }

            const adjustedWeight = weight / tokensArr.length;

            for (const token of tokensArr) {
                if (TfIdf.isStopWord(token)) { continue; }

                const val = map.get(token);
                if (val) {
                    map.set(token, val + adjustedWeight);
                } else {
                    map.set(token, adjustedWeight);
                }
            }
        }

        for (const [key, value] of map) {
            const currValue = this.allWords.get(key);
            if (currValue) {
                this.allWords.set(key, currValue + value);
            } else {
                this.allWords.set(key, value);
            }
        }

        this.documents.push([id, map]);

        return map;
    }

    public query(tokens: string | string[]): T[] {
        const tokensArr: string[] = TfIdf.stringOrArrayToTokens(tokens);

        const tokensLength = tokensArr.length;
        const results: [T, number][] = [];

        for (const [id, index] of this.documents) {
            const score = this.calcScore(tokensArr, tokensLength, index);

            if (score > 0.1) {
                results.push([id, score]);
            }
        }

        results.sort((a, b) => b[1] - a[1]);
        return results.map(e => e[0]);
    }

    public calcScore(tokens: string[], tokensLength: number, doc: Map<string, number>): number {
        let score = 0;

        for (const token of tokens) {
            const val = doc.get(token);
            if (!val) { continue; }
            const freq = this.allWords.get(token)!;
            score += val / freq / tokensLength;
        }

        return score;
    }

    public static stringOrArrayToTokens(stringOrArray: string | string[]): string[] {
        return Array.isArray(stringOrArray) ?
            stringOrArray :
            TfIdf.stringToTokens(stringOrArray)
                .filter(e => !TfIdf.isStopWord(e));
    }

    public static stringToTokens(str: string): string[] {
        return str.toLowerCase().split(/[^a-z]/);
    }

    private static isStopWord(word: string): boolean | undefined {
        return this.isStopWordMap[word];
    }
}

export default TfIdf;
import CommandResult from "./CommandResult";
import UnknownCommandResult from "./results/UnknownCommandResult";
import NavigateCommandResult from "./results/NavigateCommandResult";
import viewList from "../viewList";
import InfoCommandResult from "./results/InfoCommandResult";

class CommandParser {
    public static firstLetterFnMap: { [x: string]: (args: string) => CommandResult[] } = {
        "?": CommandParser.helpCommand,
        "/": CommandParser.navigateCommand
    };

    public static parse(command: string): CommandResult[] {
        const fn = CommandParser.firstLetterFnMap[command[0]];
        if (fn) {
            return fn(command.slice(1));
        } else {
            return CommandParser.defaultCommand(command);
        }
    }

    private static defaultCommand(command: string): CommandResult[] {
        return [new UnknownCommandResult()];
    }

    private static helpCommand(command: string): CommandResult[] {
        const keys = Object.keys(CommandParser.firstLetterFnMap);
        const results = [];

        for (const key of keys) {
            results.push(new InfoCommandResult(key));
        }

        return results;
    }

    private static navigateCommand(command: string): CommandResult[] {
        const literalResult = new NavigateCommandResult(command);
        const resultsWithScores: [number, NavigateCommandResult][] = [];

        if (command.length > 0) {
            for (const view of viewList) {
                let name = Array.isArray(view) ?
                    view[0] : view;

                const score = CommandParser.looseStartsWith(command, name);

                if (score >= 0) {
                    resultsWithScores.push([score, new NavigateCommandResult(name)]);
                }
            }
        }

        resultsWithScores.sort((a, b) => a[0] - b[0]);

        const results: NavigateCommandResult[] = [];
        for (const resultWithScore of resultsWithScores) {
            results.push(resultWithScore[1]);
        }

        results.splice(1, 0, literalResult);

        return results;
    }

    /**
     * Loosely checks if a string starts with another string
     * @param start Check the string starts with
     * @param str The string to check with
     * @returns score - larger is worse, -1 means it doesn't match
     */
    private static looseStartsWith(start: string, str: string): number {
        const strLength = str.length;
        const startLower = start.toLowerCase();
        const strLower = str.toLowerCase();
        let currStrIndex = 0;
        let skipped = 0;

        outer: for (const char of startLower) {
            for (; currStrIndex < strLength;) {
                if (strLower[currStrIndex] === char) {
                    currStrIndex++;
                    continue outer;
                } else {
                    skipped++;
                    currStrIndex++;
                }
            }

            return -1;
        }

        return skipped;
    }
}

export default CommandParser;
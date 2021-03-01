import CommandResult from "./CommandResult";
import UnknownCommandResult from "./results/UnknownCommandResult";
import NavigateCommandResult from "./results/NavigateCommandResult";
import InfoCommandResult from "./results/InfoCommandResult";
import parseShortUrl from "../../../components/url/parseShortUrl";
import getShortURLRedirectMap from "../../../components/url/getRedirectMap";
import resolveUrl from "../../../utils/resolveUrl";
import siteConfig from "../../../SiteConfig";
import looseStartsWith from "../../../utils/looseStartsWith";
import IApp from "../../../core/types/app/IApp";

class CommandParser {
    public static firstLetterFnMap: { [x: string]: (app: IApp, args: string) => Promise<CommandResult[]> } = {
        "?": CommandParser.helpCommand,
        "/": CommandParser.navigateCommand,
        "#": CommandParser.shortURLCommand
    };

    public static helpMap: { [x: string]: string } = {
        "?": "Shows commands with description",
        "/": "Navigate to url",
        "#": "Navigate with short URL"
    };

    public static parse(app: IApp, command: string): Promise<CommandResult[]> {
        const fn = CommandParser.firstLetterFnMap[command[0]];
        if (fn) {
            return fn(app, command.slice(1));
        } else {
            return CommandParser.defaultCommand(app, command);
        }
    }

    private static async defaultCommand(app: IApp, command: string): Promise<CommandResult[]> {
        return [new UnknownCommandResult()];
    }

    private static async helpCommand(app: IApp, command: string): Promise<CommandResult[]> {
        const keys = Object.keys(CommandParser.firstLetterFnMap);
        const results = [];

        for (const key of keys) {
            results.push(new InfoCommandResult(key, CommandParser.helpMap[key]));
        }

        return results;
    }

    private static async navigateCommand(app: IApp, command: string): Promise<CommandResult[]> {
        const goToExactCommandAddressResult = new NavigateCommandResult(command);
        const resultsWithScores: [number, NavigateCommandResult][] = [];

        const path = command.split("/");
        const pathFinalName = path.pop()!;

        const viewOrWidgetList = app.routes.getRouter(path).list();

        for (const view of viewOrWidgetList) {
            if (typeof view !== "string") { continue; }

            let name = Array.isArray(view) ?
                view[0] : view;

            const score = looseStartsWith(pathFinalName, name);

            if (score >= 0) {
                resultsWithScores.push([score,
                    new NavigateCommandResult(path.concat([name]).join("/"))
                ]);
            }
        }

        resultsWithScores.sort((a, b) => a[0] - b[0]);

        const results: NavigateCommandResult[] = [];
        for (const resultWithScore of resultsWithScores) {
            results.push(resultWithScore[1]);
        }

        results.splice(1, 0, goToExactCommandAddressResult);

        return results;
    }

    private static async shortURLCommand(app: IApp, args: string): Promise<CommandResult[]> {
        if (args[0] === '#') {
            return CommandParser.shortURLCommand_prefixed(args, "Enter project number");
        } else if (args[0] === "_") {
            return CommandParser.shortURLCommand_prefixed(args, "Enter number directly followed by project name");
        } else {
            return CommandParser.shortURLCommand_noPrefix(args);
        }
    }

    private static async shortURLCommand_noPrefix(args: string): Promise<CommandResult[]> {
        const arr: CommandResult[] = [];
        const map = await getShortURLRedirectMap();

        for (const [key, value] of map) {
            arr.push(new NavigateCommandResult(value, key));
        }

        const final = CommandParser.sortByScore(args, arr);

        if (args.length === 0) {
            final.unshift(
                new InfoCommandResult("#", "by project number"),
                new InfoCommandResult("_", "by year and name")
            );
        }

        return final;
    }

    private static async shortURLCommand_prefixed(args: string, placeholderStr: string): Promise<CommandResult[]> {
        const placeholder = [new InfoCommandResult(placeholderStr)];

        if (args.length === 1) {
            return placeholder;
        } else {
            const result = await parseShortUrl(args).catch(e => undefined);

            if (result) {
                return [new NavigateCommandResult(resolveUrl(result, siteConfig.path.thingy))];
            } else {
                return placeholder;
            }
        }
    }

    private static sortByScore<T extends CommandResult>(startsWith: string, results: T[]): T[] {
        const withScore: [number, T][] = [];

        for (const result of results) {
            const search = result.description ?
                result.label + " " + result.description :
                result.label;
            const score = looseStartsWith(startsWith, search);

            if (score >= 0) {
                withScore.push([score, result]);
            }
        }

        withScore.sort((a, b) => a[0] - b[0]);

        const final: T[] = [];

        for (const result of withScore) {
            final.push(result[1]);
        }

        return final;
    }
}

export default CommandParser;
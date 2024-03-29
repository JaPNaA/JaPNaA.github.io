import { isIterableObjectEqual } from "./utils/isIterableObjectEqual";
import stringify from "./utils/stringify";

abstract class Test {
    public abstract name: string
    constructor() { }
    public abstract setup(): void;
    public abstract run(): Promise<void>;
    public abstract destory(): void;
    public abstract getResult(): TestResult;
}

export class Tester {
    public test(test: Test) {
        test.setup();
        test.run();
    }
}

export class TestList extends Test {
    public name: string;
    private tests: Test[];
    private results: TestResult[];
    private passed: boolean;

    constructor(tests: Test[], name?: string) {
        super();
        this.results = [];
        this.name = name || this.constructor.name;
        this.tests = tests;
        this.passed = true;
    }

    public setup(): void { }
    public destory(): void { }
    public async run(): Promise<void> {
        const promises = [];

        for (const test of this.tests) {
            this.setup();
            promises.push(this.runAndGetResult(test));
            this.destory();
        }

        await Promise.all(promises);

        for (const result of this.results) {
            if (!result.passed) {
                this.passed = false;
                break;
            }
        }
    }

    public getMessage(passed: boolean): string {
        return passed ? "All tests passed" : "One or more tests failed";
    }

    public getResult(): TestResult {
        return new TestResult(this.name, this.passed, this.results, this.getMessage(this.passed));
    }

    private async runAndGetResult(test: Test): Promise<void> {
        await test.run();
        this.results.push(test.getResult());
    }
}

export abstract class TestRunner extends Test {
    public name: string;
    protected nextAssertTests?: string;
    protected stopAfterFailedAssert: boolean = true;
    private passed: boolean;
    private assertions: Assertion[];

    public constructor(name?: string) {
        super();
        this.name = name || this.constructor.name;
        this.assertions = [];
        this.passed = true;
    }

    public abstract runTests(): void;
    public setup(): void { };
    public destory(): void { };
    protected getMessage(passed: boolean): string {
        return passed ? "Test passed" : "Test failed";
    }

    public async run(): Promise<void> {
        try {
            this.setup();
            await this.runTests();
            this.destory();
        } catch (err) {
            this.logError(err as any);
        }
    }

    public getResult(): TestResult {
        return new TestResult(
            this.name, this.passed, this.assertions, this.getMessage(this.passed)
        );
    }

    protected assertTrue(v: boolean, name_?: string) {
        const name = name_ || "value";
        if (v === true) {
            this.passAssertion(name + " is true");
        } else {
            this.failAssertion(name + " was false, expected true");
        }
    }

    protected assertFalse(v: boolean, name_?: string) {
        const name = name_ || "value";
        if (v === false) {
            this.passAssertion(name + " is false");
        } else {
            this.failAssertion(name + " was true, expected false");
        }
    }

    protected assertEquals(a: any, b: any, aName_?: string, bName_?: string) {
        const aName = aName_ || "value";
        const bName = bName_ || stringify(b);
        if (a === b) {
            this.passAssertion(aName + " is equal to " + bName +
                ((bName_ === undefined) ? "" : ", " + stringify(b))
            );
        } else {
            this.failAssertion(
                aName + " was not equal to " + bName + ", " +
                aName + " was " + stringify(a) + (
                    (bName_ === undefined) ?
                        '' : (
                            ', and ' + bName + ' was ' + stringify(b)
                        )
                )
            );
        }
    }

    protected assertIterableObjectEquals<T extends object>(a: T | undefined, b: T | undefined, aName_?: string, bName_?: string) {
        const aName = aName_ || "value";
        const bName = bName_ || stringify(b);
        if (a === undefined || b === undefined) {
            this.failAssertion(aName + " or " + bName + " is undefined when expecting an object");
            return;
        }
        if (isIterableObjectEqual(a, b)) {
            this.passAssertion(aName + " is equal to " + bName + ", " + bName);
        } else {
            this.failAssertion(
                aName + " was not equal to " + bName + ", " +
                aName + " was " + stringify(a) + (
                    (bName_ === undefined) ?
                        '' : (
                            ', and ' + bName + ' was ' + stringify(b)
                        )
                )
            );
        }
    }

    protected assertNotRunningThisLine(message?: string): void {
        this.logError(new Error(message || "Illegal state"));
    }

    protected assertRunningThisLine(message?: string): void {
        this.passAssertion(message || "Ran this line");
    }

    private logError(error: Error): void {
        if (this.passed || !this.stopAfterFailedAssert) {
            const stack = error.stack ? error.stack : error.toString();
            this.assertions.push(new FailedAssertion(stack + "\nStopping."));
            console.error(error);
        } else {
            this.assertions.push(new FailedAssertion("Error occurred when running tests. Stopping."));
        }
        this.passed = false;
    }

    private failAssertion(fail: string): void {
        let message;

        if (this.nextAssertTests) {
            message = "Failed: " + this.useNextAssertionTestName();
        } else {
            message = fail;
        }

        this.nextAssertTests = undefined;

        this.assertions.push(new FailedAssertion(message));
        this.passed = false;

        console.error(message);

        if (this.stopAfterFailedAssert) {
            debugger; //! INTENDED DEBUGGER STATEMENT
            throw new Error("Assertion failed");
        }
    }

    private passAssertion(pass: string): void {
        let message;

        if (this.nextAssertTests) {
            message = "Passed: " + this.useNextAssertionTestName();
        } else {
            message = pass;
        }

        this.assertions.push(new PassedAssertion(message));
    }

    private useNextAssertionTestName(): string | undefined {
        const str = this.nextAssertTests;
        this.nextAssertTests = undefined;
        return str;
    }
}

export interface Passable {
    message?: string,
    passed: boolean
}

export class TestResult implements Passable {
    public constructor(
        public testName: string,
        public passed: boolean,
        public assertions: Passable[],
        public message?: string
    ) { }
}


export abstract class Assertion implements Passable {
    constructor(
        public passed: boolean,
        public message: string
    ) { }
}

class FailedAssertion extends Assertion {
    constructor(message: string) {
        super(false, message);
    }
}

class PassedAssertion extends Assertion {
    constructor(message: string) {
        super(true, message);
    }
}
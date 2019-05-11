import { isIterableObjectEqual } from "./utils/isIterableObjectEqual";

abstract class Test {
    public abstract name: string
    constructor() { }
    public abstract setup(): void;
    public abstract run(): void;
    public abstract destory(): void;
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

    constructor(tests: Test[], name?: string) {
        super();
        this.name = name || this.constructor.name;
        this.tests = tests;
    }

    public setup(): void { }
    public destory(): void { }
    public run(): void {
        for (const test of this.tests) {
            this.setup();
            test.run();
            this.destory();
        }
    }
}

export abstract class TestRunner extends Test {
    public name: string;
    protected nextAssertTests?: string;
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

    public run(): void {
        this.setup();
        this.runTests();
        this.destory();
    }

    public getResults(): TestResult[] {
        return [new TestResult(
            this.name, this.passed, this.assertions, this.getMessage(this.passed)
        )];
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
        const bName = bName_ || b.toString();
        if (a === b) {
            this.passAssertion(aName + " is equal to " + bName + ", " + bName);
        } else {
            this.failAssertion(
                aName + " was not equal to " + bName + ", " +
                aName + " was " + a.toString() + (
                    (bName_ === undefined) ?
                        '' : (
                            ', and ' + bName + ' was ' + b.toString()
                        )
                )
            );
        }
    }

    protected assertIterableObjectEquals<T>(a: T, b: T, aName_?: string, bName_?: string) {
        const aName = aName_ || "value";
        const bName = bName_ || b.toString();
        if (isIterableObjectEqual(a, b)) {
            this.passAssertion(aName + " is equal to " + bName + ", " + bName);
        } else {
            this.failAssertion(
                aName + " was not equal to " + bName + ", " +
                aName + " was " + a.toString() + (
                    (bName_ === undefined) ?
                        '' : (
                            ', and ' + bName + ' was ' + b.toString()
                        )
                )
            );
        }
    }

    private failAssertion(fail: string) {
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

        debugger; //! INTENDED DEBUGGER STATEMENT

        throw new Error("Assertion failed");
    }

    private passAssertion(pass: string) {
        let message;

        if (this.nextAssertTests) {
            message = "Passed: " + this.useNextAssertionTestName();
        } else {
            message = pass;
        }

        this.assertions.push(new PassedAssertion(message));
    }

    private useNextAssertionTestName() {
        const str = this.nextAssertTests;
        this.nextAssertTests = undefined;
        return str;
    }
}

interface Passable {
    message?: string,
    passed: boolean
}

class TestResult implements Passable {
    public constructor(
        public testName: string,
        public passed: boolean,
        public assertions: Passable[],
        public message?: string
    ) { }
}

abstract class Assertion implements Passable {
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
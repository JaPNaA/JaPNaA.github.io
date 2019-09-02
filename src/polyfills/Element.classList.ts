export default function apply() {
    Object.defineProperty(HTMLElement.prototype, "classList", {
        get: function () {
            const that = this;

            return {
                get length(): number {
                    return that.className.split(" ").length;
                },

                get value(): string {
                    return that.className;
                },

                contains(token: string): boolean {
                    return that.className.split(" ").indexOf(token) >= 0;
                },

                item(index: number): string {
                    return that.className.split(" ")[index];
                },

                add(): void {
                    const tokens = that.className.split(" ");
                    if (tokens[0] === '') {
                        tokens.length = 0;
                    }

                    for (let i = 0, length = arguments.length; i < length; i++) {
                        if (arguments[i].length === 0) { throw new SyntaxError("Token cannot be empty"); }
                        if (/\s/.test(arguments[i])) { throw new SyntaxError("Token cannot contain whitespace"); }
                        if (tokens.indexOf(arguments[i]) < 0) {
                            tokens.push(arguments[i]);
                        }
                    }

                    that.className = tokens.join(" ");
                },

                remove(): void {
                    const tokens = that.className.split(" ");

                    for (let i = 0, length = arguments.length; i < length; i++) {
                        if (arguments[i].length === 0) { throw new SyntaxError("Token cannot be empty"); }
                        if (/\s/.test(arguments[i])) { throw new SyntaxError("Token cannot contain whitespace"); }

                        const tokenIndex = tokens.indexOf(arguments[i]);
                        if (tokenIndex >= 0) {
                            tokens.splice(tokenIndex, 1);
                        }
                    }

                    that.className = tokens.join(" ");
                },

                replace(oldToken: string, newToken: string): boolean {
                    for (const token of [oldToken, newToken]) {
                        if (token.length === 0) { throw new SyntaxError("Token cannot be empty"); }
                        if (/\s/.test(token)) { throw new SyntaxError("Token cannot contain whitespace"); }
                    }

                    const tokens = that.className.split(" ");

                    for (let i = 0, length = tokens.length; i < length; i++) {
                        if (tokens[i] === oldToken) {
                            tokens[i] = newToken;
                            return true;
                        }
                    }

                    that.className = tokens.join(" ");

                    return false;
                },

                supports(): false {
                    return false;
                },

                toggle(token: string): boolean {
                    if (token.length === 0) { throw new SyntaxError("Token cannot be empty"); }
                    if (/\s/.test(token)) { throw new SyntaxError("Token cannot contain whitespace"); }

                    const tokens = that.className.split(" ");

                    for (let i = 0, length = tokens.length; i < length; i++) {
                        if (tokens[i] === token) {
                            tokens.splice(i, 1);
                            return false;
                        }
                    }

                    tokens.push(token);

                    that.className = tokens.join(" ");

                    return true;
                },

                forEach(cb: (value: string, key: number, self: DOMTokenList) => void): void {
                    const tokens = that.className.split(" ");
                    for (let i = 0, length = tokens.length; i < length; i++) {
                        cb(tokens[i], i, this);
                    }
                }
            };
        }
    });
}
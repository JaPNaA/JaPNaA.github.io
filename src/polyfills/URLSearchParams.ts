export default function apply() {
    // note: partial implementation -- only the part that i use

    // @ts-ignore
    window.URLSearchParams = class URLSearchParamsPolyfill {
        private map: Map<string, string>;

        constructor(init_: string) {
            this.map = new Map();

            let init = init_;
            if (init[0] === "?") {
                init = init.slice(1);
            }

            const pairs = init.split("&");

            for (const pair of pairs) {
                const [key, value] = pair.split("=");
                this.map.set(decodeURIComponent(key), decodeURIComponent(value));
            }
        }

        public get(key: string): string | null{
            return this.map.get(key) || null;
        }
    }
}
declare module "*.less" {
    const cssNameMap: { [x: string]: string };
    export = cssNameMap;
}

/**
 * Macro defined in webpack/loaders/routeMacro.js
 * 
 * Creates a route entry for Router constructor
 * 
 * @param path path to route
 */
declare function $$route(path: string): [string, any];
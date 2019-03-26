type JSONType = string | string[] | number | number[] | boolean | boolean[] | JSONObject | JSONObject[];
type JSONObject = { [x: string]: JSONType };

export { JSONObject, JSONType };
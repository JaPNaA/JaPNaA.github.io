/**
 * @typedef {"always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"} SitemapEntryChangeFrequency
 */

/**
 * @typedef SitemapEntry
 * @property {string} url
 * @property {Date} [lastModified]
 * @property {SitemapEntryChangeFrequency} [changeFreq]
 * @property {number} [priority] importance: <least> 0 -> 1 <most>
 */

// causes vscode to make this file a module, allowing jsdoc stuff to be imported
module.exports = null;
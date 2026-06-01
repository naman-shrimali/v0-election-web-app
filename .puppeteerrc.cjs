/**
 * .puppeteerrc.cjs
 * Configures puppeteer's cache directory explicitly so it always finds
 * the downloaded Chromium regardless of how the process is started.
 */
const { join } = require("path")
const { homedir } = require("os")

/** @type {import("puppeteer").Configuration} */
module.exports = {
  // Point to the standard user cache — same place `npx puppeteer browsers install` puts it
  cacheDirectory: join(homedir(), ".cache", "puppeteer"),
}

"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/find-chrome.ts
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
const paths = process.platform === "darwin" ? [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
] : process.platform === "win32" ? [
  process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
  process.env.PROGRAMFILES + "/Google/Chrome/Application/chrome.exe",
  process.env["PROGRAMFILES(X86)"] + "/Google/Chrome/Application/chrome.exe",
  process.env.LOCALAPPDATA + "/Chromium/Application/chrome.exe",
  process.env.PROGRAMFILES + "/Chromium/Application/chrome.exe",
  process.env["PROGRAMFILES(X86)"] + "/Chromium/Application/chrome.exe"
] : [
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/snap/bin/chromium"
];
function findChrome(chromePath) {
  if (chromePath) {
    paths.push(chromePath);
  }
  for (const p of paths) {
    if (_fs2.default.existsSync(p)) {
      return p;
    }
  }
  throw new Error(`Cannot find Chrome on your system`);
}

// src/index.ts
var _url = require('url');
var _debug = require('debug'); var _debug2 = _interopRequireDefault(_debug);
var _puppeteercore = require('puppeteer-core'); var _puppeteercore2 = _interopRequireDefault(_puppeteercore);
var _htmlminifier = require('html-minifier');
const debugRequest = _debug2.default.call(void 0, "taki:request");
const resourceTypeBlacklist = new Set(["stylesheet", "image", "media", "font"]);
async function getHTML(browser2, options) {
  options.onBeforeRequest && options.onBeforeRequest(options.url);
  const page = await browser2.newPage();
  await page.setRequestInterception(true);
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36 Prerender");
  if (options.onCreatedPage) {
    await options.onCreatedPage(page);
  }
  page.on("request", (interceptedRequest) => {
    const type = interceptedRequest.resourceType();
    const resourceURL = interceptedRequest.url();
    const next = () => {
      debugRequest(`Fetched: ${resourceURL}`);
      interceptedRequest.continue();
    };
    const abort = () => {
      debugRequest(`Aborted: ${resourceURL}`);
      return interceptedRequest.abort();
    };
    if (options.blockCrossOrigin && _url.parse.call(void 0, resourceURL).host !== _url.parse.call(void 0, options.url).host) {
      return abort();
    }
    if (resourceTypeBlacklist.has(type)) {
      return abort();
    }
    if (options.resourceFilter && !options.resourceFilter({url: resourceURL, type})) {
      return abort();
    }
    return next();
  });
  let resolveFunction;
  let content = "";
  const promise = new Promise((resolve) => resolveFunction = resolve);
  if (options.manually) {
    const functionName = typeof options.manually === "string" ? options.manually : "snapshot";
    await page.exposeFunction(functionName, (result2) => {
      resolveFunction(result2);
    });
  }
  await page.goto(options.url, {
    waitUntil: options.manually ? "domcontentloaded" : "networkidle2"
  });
  let result;
  if (options.manually) {
    result = await promise;
  } else if (options.wait === "number") {
    await page.waitFor(options.wait);
  } else if (options.wait === "string") {
    await page.waitForSelector(options.wait);
  }
  content = result ? result.content : await page.content();
  options.onBeforeClosingPage && await options.onBeforeClosingPage(page);
  await page.close();
  options.onAfterRequest && options.onAfterRequest(options.url);
  const minifyOptions = typeof options.minify === "object" ? options.minify : {
    minifyCSS: true,
    minifyJS: true,
    collapseWhitespace: true,
    decodeEntities: true,
    removeComments: true,
    removeAttributeQuotes: true,
    removeScriptTypeAttributes: true,
    removeRedundantAttributes: true,
    removeStyleLinkTypeAttributes: true
  };
  return options.minify ? _htmlminifier.minify.call(void 0, content, minifyOptions) : content;
}
let browser;
async function request(options) {
  if (!browser) {
    let chromePath;
    if (Array.isArray(options)) {
      const optChromePath = options.find((opt) => opt.chromePath);
      if (optChromePath)
        chromePath = optChromePath.chromePath;
    } else {
      chromePath = options.chromePath;
    }
    browser = await _puppeteercore2.default.launch({
      executablePath: findChrome(chromePath)
    });
  }
  try {
    const result = Array.isArray(options) ? await Promise.all(options.map((option) => getHTML(browser, option))) : await getHTML(browser, options);
    return result;
  } catch (error) {
    throw error;
  }
}
async function cleanup() {
  if (browser) {
    await browser.close();
    browser = void 0;
  }
}
function getBrowser() {
  return browser;
}




exports.cleanup = cleanup; exports.getBrowser = getBrowser; exports.request = request;

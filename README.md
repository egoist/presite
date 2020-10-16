# presite

[![NPM version](https://img.shields.io/npm/v/presite.svg?style=flat)](https://npmjs.com/package/presite) [![NPM downloads](https://img.shields.io/npm/dm/presite.svg?style=flat)](https://npmjs.com/package/presite) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/sponsors/egoist)

## Why Presite?

Presite is an alternative to static site generators like Gatsby, Next.js and Nuxt.js etc, the difference is that it uses [Puppeteer](https://pptr.dev) to prerender websites instead of relying on server-side rendering.

## Install

```bash
npm i -g presite
```

**Note that Presite relies on Chrome (or Chromium) browser on your machine, so you need to ensure it's installed before running Presite**.

## Usage

```bash
presite ./path/to/your/site
```

Presite is supposed to work with existing single-page applications, first you use something like Create React App, Vue CLI, Parcel or Vite to create a production build of your app, then use Presite to pre-render the website to static HTML files.

Pre-rendered website will be generated into `.presite` folder.

## Examples

<details><summary>with Create React App</summary>

```diff
{
  "scripts": {
-    "build": "react-scripts build"
+    "build": "react-scripts build && presite ./build"
  }
}
```

</details>

<details><summary>with Vue CLI</summary>

```diff
{
  "scripts": {
-    "build": "vue-cli-service build"
+    "build": "vue-cli-service build && presite ./dist"
  }
}
```

</details>

<details><summary>with Poi</summary>

```diff
{
  "scripts": {
-    "build": "poi build"
+    "build": "poi build && presite ./dist"
  }
}
```

</details>

<details><summary>with Vite</summary>

```diff
{
  "scripts": {
-    "build": "vite build"
+    "build": "vite build && presite ./dist"
  }
}
```

</details>

**That's it, Presite prerender all pages of your website without any configuration!**

Run `presite --help` for all CLI flags.

## Non-HTML pages

Presite also supports rendering non-HTML pages like XML or JSON pages, simply create files ending with `.xml.js` or `.json.js`, let's say you have a `feed.json.js`:

```js
import { createJSONFeed } from './somewhere/create-json-feed'

export default async () => {
  const posts = await fetch('/api/my-posts').then((res) => res.json())
  return createJSONFeed(posts)
}
```

You can export a function that resolves to a string or JSON object, then Presite will output this page as `feed.json`.

These pages are evaluated in browser in a `<script type="module">` tag, so you can use the `import` keyword.

## Using `presite.config.js`

Many CLI flags can be stored in a configuration file, it's totaly optional but if you need one, it's there for you.

Besides `presite.config.js`, you can also use `presite.config.json` or the `presite` key in `package.json`.

### Set routes that needs prerender

If some of your pages are not referenced by other pages, you can manually specify them here:

```js
module.exports = {
  routes: ['/', '/about'],
}
```

**Note that in most cases you won't need this option, Presite automatically find all same-site `<a>` elements on the pages and prerender all of them.**

If you want to fetch routes asynchronously, use `async/await`:

```js
module.exports = {
  async routes() {
    const routes = await fetchRoutesFromSomeWhere()
    return routes
  },
}
```

### Wait

Wait specific ms or dom element to appear:

```js
module.exports = {
  wait: 3000,
  // Or wait for an element to appear
  // wait: '#comments'
}
```

### Maunally set ready state

Instead of using `wait` you can manually tell when the app is ready:

```js
module.exports = {
  manually: true,
}
```

Then you can call `window.snapshot` in your app when its contents are ready:

```js
window.snapshot && window.snapshot()
```

To use a custom global variable name, set it to a string instead:

```js
module.exports = {
  manually: `__my_snapshot__`,
}
```

Now you should call `window.__my_snapshot__()` instead.

### Access Puppeteer browser page

Access the [`page`](https://pptr.dev/#?product=Puppeteer&version=v5.2.1&show=api-class-page) instance, for example, to expose some functions from Node.js to browser:

```js
module.exports = {
  async onBrowserPage(page) {
    await page.exposeFunction('md5', (content) => md5(content))
  },
}
```

### Source directory

This is the same as using CLI `presite ./path/to/your/spa`:

```js
module.exports = {
  baseDir: './path/to/your/spa',
}
```

### Output directory

By default it outputs to `.presite` folder in current directory.

```js
module.exports = {
  outDir: '.presite',
}
```

## CLI options

Run `presite --help`.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**presite** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/presite/contributors)).

> [Website](https://egoist.sh) · GitHub [@egoist](https://github.com/egoist) · Twitter [@\_egoistlily](https://twitter.com/_egoistlily)

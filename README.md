# presite

[![NPM version](https://img.shields.io/npm/v/presite.svg?style=flat)](https://npmjs.com/package/presite) [![NPM downloads](https://img.shields.io/npm/dm/presite.svg?style=flat)](https://npmjs.com/package/presite) [![CircleCI](https://circleci.com/gh/egoist/presite/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/presite/tree/master) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/sponsors/egoist)

## Why Presite?

Presite is an alternative to static site generators like Gatsby, Next.js and Nuxt.js etc, the difference is that it uses [Puppeteer](https://pptr.dev) to prerender websites instead of relying on server-side rendering.

## Install

```bash
npm i -g presite
```

**Note that Presite relies on Chrome (or Chromium) browser on your machine, so you need to ensure it's installed before running Presite**.

## Usage

```bash
presite ./path/to/your/spa
```

Then the generated website can be found at `.presite` folder.

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

## Configure in presite.config.js

Many CLI flags can be stored in a configuration file, that's totaly optional but if you need one, read on.

Note: You can also configuration it in `presite.config.json` or the `presite` key in `package.json`.

#### Set routes that needs prerender

**Note that in most cases you won't need this option, Presite automatically find all same-site `<a>` elements on the pages and prerender all of them.**

If some of your pages are not referenced by other pages, you can manually specify them here:

```js
module.exports = {
  routes: ['/', '/about'],
}
```

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

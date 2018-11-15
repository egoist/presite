# presite

[![NPM version](https://img.shields.io/npm/v/presite.svg?style=flat)](https://npmjs.com/package/presite) [![NPM downloads](https://img.shields.io/npm/dm/presite.svg?style=flat)](https://npmjs.com/package/presite) [![CircleCI](https://circleci.com/gh/egoist/presite/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/presite/tree/master) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Why (not) prerender?

- It works for every single-page website
- It requires no modification on your app code
- It does **not** suite large website that heavily depends on async data, use SSR instead.

## Install

```bash
npm i -g presite

# China mirror for downloading chromium
npm config set puppeteer_download_host=https://storage.googleapis.com.cnpmjs.org
npm i -g presite
```

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
<br>

By default it only prerenders path: `/`, you can configure `routes` option for more, see below:

## Configure in presite.config.js

Note: You can also configuration it in `presite.config.json` or the `presite` key in `package.json`.

#### Set routes that needs prerender

```js
module.exports = {
  routes: ['/', '/about']
}
```

If you want to fetch routes asynchronously, use `async/await`:

```js
module.exports = {
  async routes() {
    const routes = await fetchRoutesFromSomeWhere()
    return routes
  }
}
```

### Wait

Wait specific ms or dom element to appear:

```js
module.exports = {
  wait: 3000
  // Or wait for an element to appear
  // wait: '#comments'
}
```

### Maunally set ready state

Instead of using `wait` you can manually tell when the app is ready:

```js
module.exports = {
  manually: true
}
```

Then you can call `window.snapshot` in your app when its contents are ready:

```js
window.snapshot && window.snapshot()
```

### Source directory

```js
module.exports = {
  baseDir: './path/to/your/spa'
}
```

### Output directory

By default it outputs to `.presite` folder in current directory.

```js
module.exports = {
  outDir: '.presite'
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

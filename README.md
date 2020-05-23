# presite

[![NPM version](https://img.shields.io/npm/v/presite.svg?style=flat)](https://npmjs.com/package/presite) [![NPM downloads](https://img.shields.io/npm/dm/presite.svg?style=flat)](https://npmjs.com/package/presite) [![CircleCI](https://circleci.com/gh/egoist/presite/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/presite/tree/master) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Why (not) prerender?

- It works for every single-page website
- It requires no modification on your app code
- But it does **not** suit a large website which depends heavily on async data - SSR would be preferred for that.

## Install

```bash
npm i -g presite

# China mirror for downloading chromium
npm config set puppeteer_download_host=https://storage.googleapis.com.cnpmjs.org
npm i -g presite
```

## Usage

### CLI options

```bash
presite <command> [options]
```

Options can be configured using flags as shown by the CLI help, or using a [config](#configure) file.

### Display help

```bash
presite --help
```

### Prerender a target directory

The basic use is to prerender against your single-page application's build directory. 

```bash
presite BUILD_DIR
```

Use `dist` or `build` for example as the target.

Note that your application does not need be running.

By default, presite will only look at the app's root path. To set custom routes, see [Set routes that needs prerender](#set-routes-that-needs-prerender).

### Set custom output directory

Presite will create a `.presite` directory in your project root and write files to it. 

You can override this as in the example below:

```bash
presite dist -o static-html
```

Or configure it once - see the [Output directory](#output-directory) section.

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

## Configure

### Choose a config file approach

Presite will work without a config file.

But you can optionally create a config file to override settings - use one of the follow approaches:

#### Create JavaScript config

Add `presite.config.js` to your project's root and add presite fields.

For example:

```javascript
module.exports = {
  routes: ['/']
}
```

#### Create JSON config

Add `presite.config.json` to your project's root and add presite fields.

For example:

```json
{
  "routes": ["/"]
}
```

#### Use the package config

Update your `package.json` to include a `presite` key and presite fields.

For example:

```json
{
  "name": "my-app",
  "presite": {
    "routes": [
      "/"
    ]
  }
}
```

#### Set routes that needs prerender

Presite will render the **root path** (`'/'`) by default. You can override this by providing an array of paths for the `routes` field.

For example:

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

Set a wait duration in milliseconds:

```js
module.exports = {
  wait: 3000
}
```

Or wait for an element to appear in the DOM:

```js
module.exports = {
  wait: '#comments'
}
```

### Manually set ready state

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

By default, presite outputs to a `.presite` folder in the current directory.

```js
module.exports = {
  outDir: '.presite'
}
```

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

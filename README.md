# presite

[![NPM version](https://img.shields.io/npm/v/presite.svg?style=flat)](https://npmjs.com/package/presite) [![NPM downloads](https://img.shields.io/npm/dm/presite.svg?style=flat)](https://npmjs.com/package/presite) [![CircleCI](https://circleci.com/gh/egoist/presite/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/presite/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Install

```bash
yarn global add presite
```

## Usage

```bash
presite ./path/to/your/spa
```

Then the generated website can be found at `.presite` folder.

## Examples

<details><summary>with create-react-app</summary>

```diff
{
  "scripts": {
-    "build": "react-scripts build"
+    "build": "react-scripts build && presite ./build"
  }
}
```
</details>

<details><summary>with vuejs-templates/webpack</summary>

```diff
{
  "scripts": {
-    "build": "node build/build.js"
+    "build": "node build/build.js && presite ./dist"
  }
}
```
</details>
<br>

By default it only prerenders path: `/`, you can configure `routes` option for more, see below:

## Configure in package.json

#### Use Chrome headless

By default it uses JSDOM, but you can use Chrome instead:

```js
{
  "presite": {
    "browser": "chrome"
  }
}
```

#### Set routes that needs prerender

```js
{
  "presite": {
    "routes": [
      "/",
      "/about"
    ]
  }
}
```

### Wait

Wait specific ms for the app to get ready:

```js
{
  "presite": {
    "wait": 3000
  }
}
```

### Maunally set ready state

Instead of using `wait` you can manually tell when the app is ready:

```js
{
  "presite": {
    "manually": true
  }
}
```

Then you can call `window.snapshot` in your app when its contents are ready:

```js
window.snapshot && window.snapshot()
```

### Source directory

```js
{
  "presite": {
    "baseDir": "./path/to/your/spa"
  }
}
```

### Output directory

By default it outputs to `.presite` folder in current directory.

```js
{
  "presite": {
    "outDir": ".presite"
  }
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

> [egoist.moe](https://egoist.moe) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)

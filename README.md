# web-assets-manager

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Dependency Status](https://img.shields.io/david/m31271n/web-assets-manager.svg)](#)
[![DevDependency Status](https://img.shields.io/david/m31271n/web-assets-manager.svg)](#)
[![Travis Build Status](https://img.shields.io/travis/m31271n/web-assets-manager.svg)](#)
[![NPM Downloads](https://img.shields.io/npm/dm/web-assets-manager.svg)](#)

> Manager for web assets.

## Install

```
$ npm install web-assets-manager
```

## Usage

```javascript
// wam is a singletone
import wam from 'web-assets-manager';

const assets = {
  logo: 'https://cdn.example.com/logo.png',
  bg: 'https://cdn.example.com/bg.jpg',
  // ...
};

// setup assets
wam.setup(assets);

// preload assets
wam.preload(
  function onProgress(currentProgress) {
    console.log(currentProgress);
  },
  function onComplete() {
    console.log('complete');
  }
);

// get assets
wam.get('logo'); // 'https://cdn.example.com/logo.png'
wam.get('bg'); // 'https://cdn.example.com/bg.jpg'
```

## Todo

* documents about API
* strict type checking

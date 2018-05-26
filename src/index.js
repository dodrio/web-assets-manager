'use strict';

// simple wrapper for XMLHttpRequest
function fetchURL(name, url) {
  return new Promise(function(resolve, reject) {
    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    function onResolved(ctx) {
      const blob = ctx.response;
      resolve([name, blob]);
    }

    function onRejected() {
      reject([name, url]);
    }

    xhr.onload = function() {
      if ((this.status >= 200 && this.status < 300) || this.status === 304) {
        onResolved(this);
      } else {
        onRejected(this);
      }
    };

    xhr.onerror = function() {
      onRejected(this);
    };

    xhr.send();
  });
}

class WebAssetsManager {
  constructor() {
    this.assets = {};
    this.cache = {};
  }

  setup(assets) {
    this.assets = Object.assign(this.assets, assets);
  }

  preload(progress, complete) {
    const assets = Object.entries(this.assets);
    const totalCount = assets.length;
    let currentCount = 0;
    let currentProgress = 0;

    const saveAsBlobURL = ([name, data]) => {
      if (data instanceof Blob) {
        const blobURL = URL.createObjectURL(data);
        this.cache[name] = blobURL;
      } else {
        this.cache[name] = data;
      }

      return [name, data];
    };

    const handleProgress = () => {
      currentCount += 1;
      currentProgress = currentCount / totalCount;
      if (progress) {
        progress(currentProgress);
      }
    };

    const promises = assets.map(([name, url]) =>
      fetchURL(name, url)
        .then(saveAsBlobURL)
        .then(handleProgress)
        .catch(handleProgress)
    );

    Promise.all(promises).then(() => {
      if (complete) {
        complete();
      }
    });
  }

  get(name) {
    if (this.cache[name]) {
      return this.cache[name];
    } else {
      // eslint-disable-next-line
      console.warn(
        "[web-assets-manager] You are get assets via URL, not from cache. Although it works, but it's better to check it now."
      );
      return this.assets[name];
    }
  }
}

module.exports = new WebAssetsManager();

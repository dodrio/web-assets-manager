'use strict';

// simple wrapper for XMLHttpRequest
function fetchURL(name, url) {
  return new Promise(function(resolve, reject) {
    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if ((this.status >= 200 && this.status < 300) || this.status === 304) {
        resolve([name, this.response]);
      } else {
        reject({
          status: this.status,
          statusText: this.statusText,
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: this.statusText,
      });
    };
    xhr.send();
  });
}

class WebAssetsManager {
  constructor() {
    this.cache = {};
  }

  setup(assets) {
    this.assets = assets;
  }

  preload(progress, complete) {
    const assets = Object.entries(this.assets);
    const totalCount = assets.length;
    let currentCount = 0;
    let currentProgress = 0;

    const saveAsBlobURL = ([name, response]) => {
      const blob = new Blob([response]);
      const blobURL = URL.createObjectURL(blob);
      this.cache[name] = blobURL;
      return [name, response];
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
    );
    Promise.all(promises).then(() => {
      if (complete) {
        complete();
      }
    });
  }

  get(name) {
    return this.cache[name] || this.assets[name];
  }
}

module.exports = new WebAssetsManager();

'use strict';

// simple wrapper for XMLHttpRequest
function fetchURL(name, url) {
  return new Promise(function(resolve, reject) {
    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';

    function onResolved() {
      const blob = this.response;
      resolve([name, blob]);
    }

    function onRejected() {
      reject([
        name,
        url,
        {
          status: this.status,
          statusText: this.statusText,
        },
      ]);
    }

    xhr.onload = function() {
      if ((this.status >= 200 && this.status < 300) || this.status === 304) {
        onResolved();
      } else {
        onRejected();
      }
    };

    xhr.onerror = function() {
      onRejected();
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

    const saveAsBlobURL = ([name, blob]) => {
      const blobURL = URL.createObjectURL(blob);
      this.cache[name] = blobURL;
      return [name, blob];
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
    return this.cache[name] || this.assets[name];
  }
}

module.exports = new WebAssetsManager();

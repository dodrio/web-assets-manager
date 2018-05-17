'use strict';

// simple wrapper for XMLHttpRequest
function fetchURL(url) {
  return new Promise(function(resolve, reject) {
    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if ((this.status >= 200 && this.status < 300) || this.status === 304) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
}

class WebAssetsManager {
  setup(assets) {
    this.assets = assets;
  }

  preload(progress, complete) {
    const urls = Object.values(this.assets);
    const totalCount = urls.length;
    let currentCount = 0;
    let currentProgress = 0;

    function handleProgress(response) {
      currentCount += 1;
      currentProgress = currentCount / totalCount;
      if (progress) {
        progress(currentProgress);
      }
      return response;
    }

    const promises = urls.map(url => fetchURL(url).then(handleProgress));
    Promise.all(promises).then(() => {
      if (complete) {
        complete();
      }
    });
  }

  get(name) {
    return this.assets[name];
  }
}

module.exports = new WebAssetsManager();

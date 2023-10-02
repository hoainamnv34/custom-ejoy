
import { wrapperInject } from './wrapperFull'

require('../background/config');

function inject() {
  // let sc = document.createElement("script");
  // sc.src = `chrome-extension://${ chrome.runtime.id }/data/inject/Readability.js`;
  // document.head.appendChild(sc);

  // readabilityInject();
  // configInject();
  wrapperInject();

  // sc = document.createElement("script");
  // sc.src = `chrome-extension://${chrome.runtime.id}/config.js`;
  // document.head.appendChild(sc);

  // setTimeout(() => {
  //   sc = document.createElement("script");
  //   sc.src = `chrome-extension://${chrome.runtime.id}/data/inject/wrapper.js`;
  //   document.head.appendChild(sc);
  // }, 1000)

}


function init() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'readerViewAction') {
      inject();
    }
  });
}


init();

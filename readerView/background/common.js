/**
    Reader View - .Strips away clutter like buttons, background images, and changes the page's text size, contrast and layout for better readability

    Copyright (C) 2014-2020 [@rNeomy](https://add0n.com/chrome-reader-view.html)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the Mozilla Public License as published by
    the Mozilla Foundation, either version 2 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    Mozilla Public License for more details.
    You should have received a copy of the Mozilla Public License
    along with this program.  If not, see {https://www.mozilla.org/en-US/MPL/}.

    GitHub: https://github.com/rNeomy/reader-view/
    Homepage: https://add0n.com/chrome-reader-view.html
*/

/* global config */


const CONTEXT_MENU_ID = 'ejoy_context_menu';
let currentInlineTab;
// polyfill
const goBack = ({ id, url = '' }) => {
  // temporary allow navigation
  webNavigation.ids[id] = true;
  if (chrome.tabs.goBack) {
    chrome.tabs.goBack(id, () => {
      if (chrome.runtime.lastError) {
        const args = new URLSearchParams(url.split('?')[1]);
        chrome.tabs.update({
          url: args.get('url')
        });
      }
    });
  } else {
    chrome.tabs.executeScript(id, {
      code: 'history.back()'
    });
  }
};

function notify(message) {
  chrome.notifications.create({
    title: chrome.runtime.getManifest().name,
    type: 'basic',
    iconUrl: 'readerView/icons/48.png',
    message
  });
}

function onClicked(tab, embedded = false, otherWindow = false) {
  const root = chrome.runtime.getURL('');
  if (tab.url && tab.url.startsWith(root)) {
    goBack(tab);
  } else {
    chrome.tabs.query({
      active: true,
      currentWindow: !otherWindow
    }, (tabs) => {
      let tabId = tabs[0].id;
      if (tabs[1] && otherWindow) {
        tabId = tabs[1].id;
      }
      chrome.tabs.sendMessage(
        tabId,
        { type: 'readerViewAction' }
      );
    });
  //   chrome.tabs.executeScript(tab.id, {
  //     file: 'readerView/inject/Readability.js'
  //   }, () => {
  //     if (chrome.runtime.lastError) {
  //       notify(chrome.runtime.lastError.message);
  //     }
  //     else {
  //       if (localStorage.getItem('auto-fullscreen') === 'true') {
  //         chrome.windows.update(tab.windowId, {
  //           state: 'fullscreen'
  //         });
  //       }
  //       chrome.tabs.executeScript(tab.id, {
  //         file: 'readerView/background/config.js'
  //       }, () => {
  //         chrome.runtime.lastError;
  //         chrome.tabs.executeScript(tab.id, {
  //           code: 'window.embedded = ' + embedded
  //         }, () => {
  //           chrome.runtime.lastError;
  //           console.log('executeScript', config)
  //           chrome.tabs.executeScript(tab.id, {
  //             file: 'readerView/inject/wrapper.js'
  //           }, () => chrome.runtime.lastError);
  //         });
  //       });
  //     }
  //   });
  }
}

// chrome.pageAction.onClicked.addListener(onClicked);

const menus = () => config.load(() => {
  console.log('contextMenus-menus')
  chrome.contextMenus.create({
    id: 'open-in-embedded-reader-view',
    // parentId: 'toolsId',
    type: 'normal',
    title: 'Open in Reader View',
    contexts: ['browser_action'],
  }, () => chrome.runtime.lastError);
  if (config.prefs['context-open-in-reader-view']) {
    chrome.contextMenus.create({
      id: 'open-in-reader-view',
      title: 'Open in Reader View',
      contexts: ['link']
    }, () => chrome.runtime.lastError);
  } else {
    chrome.contextMenus.remove('open-in-reader-view', () => chrome.runtime.lastError);
  }
  if (config.prefs['context-open-in-reader-view-bg']) {
    chrome.contextMenus.create({
      id: 'open-in-reader-view-bg',
      title: 'Open in background Reader View',
      contexts: ['link']
    }, () => chrome.runtime.lastError);
  } else {
    chrome.contextMenus.remove('open-in-reader-view-bg', () => chrome.runtime.lastError);
  }
  if (config.prefs['context-switch-to-reader-view']) {
    chrome.contextMenus.create({
      parentId: CONTEXT_MENU_ID,
      id: 'switch-to-reader-view',
      title: 'Switch to Reader View',
      contexts: ['page', 'selection'],
      documentUrlPatterns: ['*://*/*']
    }, () => chrome.runtime.lastError);
  } else {
    chrome.contextMenus.remove('switch-to-reader-view', () => chrome.runtime.lastError);
  }
});
chrome.runtime.onInstalled.addListener(menus);
chrome.runtime.onStartup.addListener(menus);
// if (chrome.extension.inIncognitoContext) {
if (true) {
  menus();
}

const onContext = ({ menuItemId, pageUrl, linkUrl }, tab) => {
  let url = linkUrl || pageUrl;
  // dealing with internal pages
  if (url && url.startsWith('http') === false) {
    const link = new URL(url);
    const args = new URLSearchParams(link.search);
    if (args.has('url')) {
      url = args.get('url').split('#')[0] + link.hash;
    }
  }
  if (menuItemId === 'switch-to-reader-view') {
    onClicked(tab);
  } else if (menuItemId === 'inlineTranslate') {
    currentInlineTab = tab;
  } else if (menuItemId === 'open-in-embedded-reader-view') {
    onClicked(tab, false);
  } else if (menuItemId.startsWith('open-in-reader-view')) {
    chrome.tabs.create({
      url,
      openerTabId: tab.id,
      index: tab.index + 1,
      active: !menuItemId.endsWith('-bg')
    }, t => onClicked({
      id: t.id,
      url
    }));
  }
};
chrome.contextMenus.onClicked.addListener(onContext);

chrome.commands.onCommand.addListener((command) => {
  if (command === 'on-off-reader-view') {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      if (tabs.length) {
        onClicked(tabs[0]);
      }
    });
  }
});

const onUpdated = (tabId, info, tab) => {
  if (onUpdated.cache[tabId] && (info.url || info.status === 'complete')) {
    onClicked(tab);
    delete onUpdated.cache[tabId];
    if (Object.keys(onUpdated.cache).length === 0) {
      chrome.tabs.onUpdated.removeListener(onUpdated);
    }
  }
};
onUpdated.cache = {};
const cache = {};
const highlights = {};
window.highlights = highlights;
chrome.tabs.onRemoved.addListener(tabId => delete cache[tabId]);

const onMessage = (request, sender, response) => {
  const id = sender.tab ? sender.tab.id : '';
  const url = sender.tab ? sender.tab.url : '';
  if(request.type === 'open_pop_up_inline'){
    currentInlineTab = sender.tab;
  } if (request.cmd === 'open-reader' && request.article) {
    cache[sender.tab.id] = request.article;
    chrome.tabs.update(id, {
      url: chrome.runtime.getURL(`readerView/reader/index.html?id=${ id }&url=${ encodeURIComponent(url)}`)
    });
  } else if (request.cmd === 'open-reader-pdf') {
    if (currentInlineTab) {
      onClicked(currentInlineTab, false, true);
    }
  } else if (request.cmd === 'open-reader') {
    notify('Sorry, this page cannot be converted!');
  } else if (request.cmd === 'notify') {
    notify(request.msg);
  } else if (request.cmd === 'read-data') {
    cache[id].highlights = highlights[cache[id].url];
    response(cache[id]);
    // chrome.pageAction.show(id, () => chrome.pageAction.setIcon({
    //   tabId: id,
    //   path: {
    //     16: 'readerView/icons/blue/16.png',
    //     32: 'readerView/icons/blue/32.png',
    //     48: 'readerView/icons/blue/48.png'
    //   }
    // }));
  } else if (request.cmd === 'open') {
    if (request.current) {
      if (request.reader) {
        onUpdated.cache[id] = true;
        chrome.tabs.onUpdated.addListener(onUpdated);
      }
      chrome.tabs.update({
        url: request.url
      });
    } else {
      chrome.tabs.create({
        url: request.url,
        openerTabId: id,
        index: sender.tab.index + 1,
        active: false
      }, tab => request.reader && onClicked(tab));
    }
  } else if (request.cmd === 'reader-on-reload') {
    onUpdated.cache[id] = true;
    chrome.tabs.onUpdated.addListener(onUpdated);
  } else if (request.cmd === 'go-back') {
    goBack(sender.tab);
  } else if (request.cmd === 'highlights') {
    config.load(() => {
      if (request.value.length && config.prefs['cache-highlights']) {
        highlights[request.href] = request.value;
        config.prefs['highlights-keys'].unshift(request.href);
        config.prefs['highlights-keys'] = config.prefs['highlights-keys'].filter((s, i, l) => s && l.indexOf(s) === i).slice(0, config.prefs['highlights-count']);
      } else {
        delete highlights[request.href];
        const i = config.prefs['highlights-keys'].indexOf(request.href);
        if (i !== -1) {
          config.prefs['highlights-keys'].splice(i, 1);
        }
      }
      chrome.storage.local.set({
        'highlights-keys': config.prefs['highlights-keys'],
        'highlights-objects': config.prefs['highlights-keys'].reduce((p, c) => {
          p[c] = highlights[c] || {};
          return p;
        }, {})
      });
    });
  } else if (request.cmd === 'delete-cache') {
    if (typeof caches !== 'undefined') {
      caches.delete(request.cache);
    }
  }
};
window.onMessage = onMessage;
chrome.runtime.onMessage.addListener(onMessage);

// restore highlights
{
  const startup = () => config.load(() => Object.assign(highlights, config.prefs['highlights-objects']));
  chrome.runtime.onStartup.addListener(startup);
}

// on change
config.onChanged.push(prefs => {
  if (prefs['cache-highlights']) {
    if (prefs['cache-highlights'].newValue === false) {
      for (const key of Object.keys(highlights)) {
        delete highlights[key];
      }
      chrome.storage.local.set({
        'highlights-keys': [],
        'highlights-objects': {}
      });
    }
  }
  if (
    prefs['context-open-in-reader-view'] ||
    prefs['context-open-in-reader-view-bg'] ||
    prefs['context-switch-to-reader-view']
  ) {
    menus();
  }
});

/* automatic switch */
const webNavigation = () => {
  webNavigation.rules = JSON.parse(localStorage.getItem('auto-rules') || '[]').map(s => {
    if (s.startsWith('r:')) {
      try {
        return new RegExp(s.substr(2), 'i');
      } catch (e) {
        console.warn('Cannot create regexp from', s);
        return '';
      }
    }
    return s;
  }).filter(a => a);
  const next = d => {
    if (webNavigation.ids[d.tabId] !== true) {
      onClicked({
        url: d.url,
        id: d.tabId
      });
    }
  };
  const observe = d => {
    if (d.frameId === 0) {
      const { hostname } = new URL(d.url);
      for (const rule of webNavigation.rules) {
        if (rule.test) {
          if (rule.test(d.url)) {
            next(d);
            break;
          }
        } else if (hostname === rule) {
          next(d);
          break;
        }
      }
      delete webNavigation.ids[d.tabId];
    }
  };
  if (chrome.webNavigation) {
    chrome.webNavigation.onDOMContentLoaded.removeListener(observe);
    if (webNavigation.rules.length) {
      chrome.webNavigation.onDOMContentLoaded.addListener(observe, {
        url: [{
          schemes: ['http', 'https']
        }]
      });
    }
  }
};
webNavigation.ids = {};
window.webNavigation = webNavigation;
webNavigation();

// page action
if (chrome.declarativeContent) {
  const observe = () => chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            schemes: ['http', 'https', 'file']
          }
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  // if (chrome.extension.inIncognitoContext) {
  if (true) {
    observe();
  } else {
    chrome.runtime.onInstalled.addListener(observe);
  }
}
/* delete all old caches */
{
  const startup = () => typeof caches === 'object' && caches.keys().then(keys => {
    for (const key of keys) {
      caches.delete(key);
    }
  });
  chrome.runtime.onInstalled.addListener(startup);
  chrome.runtime.onStartup.addListener(startup);
}

/* FAQs & Feedback */
{
  const { management, runtime: { onInstalled, setUninstallURL, getManifest }, storage, tabs } = chrome;
  if (navigator.webdriver !== true) {
    const page = getManifest().homepage_url;
    const { name, version } = getManifest();
    onInstalled.addListener(({ reason, previousVersion }) => {
      management.getSelf(({ installType }) => installType === 'normal' && storage.local.get({
        faqs: true,
        'last-update': 0
      }, prefs => {
        if (reason === 'install' || (prefs.faqs && reason === 'update')) {
          const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
          if (doUpdate && previousVersion !== version) {
            // tabs.create({
            //   url: page + '?version=' + version + (previousVersion ? '&p=' + previousVersion : '') + '&type=' + reason,
            //   active: reason === 'install'
            // });
            storage.local.set({ 'last-update': Date.now() });
          }
        }
      }));
    });
    // setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
  }
}

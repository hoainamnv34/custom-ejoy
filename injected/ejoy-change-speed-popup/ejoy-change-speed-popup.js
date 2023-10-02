function eJOYChangeSpeedPopup() {
  let self = this;
  self.frame = null;
  self.isInjectingSD = false;
  self.popupDocument = null;
  self.isAsyncFunction = isAsyncFunction;
  self.asyncFunctions = ['hasPopup'];
  self.getSpeedPopup = getSpeedPopup;
  self.hasPopup = false;
  self.setPositionTop = setPositionTop;
  self.setPositionBottom = setPositionBottom;
  self.updateSpeedDisplay = updateSpeedDisplay;
  self.showHide = showHide
  self.setShowHide= setShowHide
  let popupElements = {
  };
  let elementIds = {
      speedSlider:'ejoyRange',
      fillBar:'fill-slider-ejoy',
      mileStoneIndicator:'ejoy-mile-stone-indicator',
  }

  function getSpeedPopup(request, sender, sendResponse) {
    sendResponse(self.hasPopup);
}

function updateSpeedDisplay(request, sender, sendResponse) {
  if(!request.fromPopup){
    handleChangeSlider(request.value, false, true)
  }
}

  function setPositionTop(top,left){
    self.frame.style.top = 120 +'px';
    self.frame.style.bottom = 'auto';
    self.frame.style.left = left + 30 + 'px';
  }

  function setPositionBottom(bottom,left){
    self.frame.style.bottom= 100 + 'px';
    self.frame.style.top = 'auto';
    self.frame.style.left=30 + 'px';
  }

  function showHide(show){
    if( self.frame.style.display === "block"){
      self.frame.style.display = "none";
    }else{
      self.frame.style.display = "block";
    }
  }

  function setShowHide(show){
    if(!show){
      self.frame.style.display = "none";
    }else{
      self.frame.style.display = "block";
    }
  }

  function injectSpeedPoup(state) {
    if (!self.isInjectingSD) {
        self.isInjectingSD = true;
        let iframe = document.createElement('iframe');
        self.frame = iframe;
        self.frame.id = "ejoy-change-speed-popup";
        self.frame.style.position = "fixed";
        self.frame.style.display = "none";
        self.frame.style.top=0;
        self.frame.style.left=0;
        // self.frame.style.width = '137px';
        self.frame.style.setProperty("width", "137px", "important");
        self.frame.style.setProperty("min-width", "137px", "important");
        self.frame.style.setProperty("max-width", "137px", "important");
        self.frame.style.setProperty("height", "355px", "important");
        // self.frame.style.height = '355px';
        self.frame.style.zIndex = "9000000000000000000";
        self.frame.style.borderStyle = "none";
        self.frame.style.background = 'white';
        self.frame.style.boxShadow= "0px 2px 10px rgba(0, 0, 0, 0.2)";
        self.frame.style.borderRadius = "5px";
        document.body.appendChild(iframe);
        self.frame.onload = () => {
            frameContentOnLoad();
        }
        fetch(chrome.runtime.getURL("injected/ejoy-change-speed-popup/ejoy-change-speed-popup.html"))
        .then((response) => {
            return response.text();
        })
        .then((popup) => {
            try {
                self.frame.contentDocument.write(popup);
                self.popupDocument = self.frame.contentDocument;
                self.frame.contentDocument.close();
            } catch (err) {
                self.frame.contentDocument.close();
            };
        }).catch(err => {
        });
    }
}
  function loadResource(type, url) {

    return new Promise((resolve, reject) => {
        let tag;
        if (!type) {
            let match = url.match(/\.([^.]+)$/);
            if (match) {
                type = match[1];
            }
        }
        if (!type) {
            type = "js";
        }
        if (type === 'css') {
            tag = document.createElement("link");
            tag.type = 'text/css';
            tag.rel = 'stylesheet';
            tag.href = url;
            self.popupDocument.head.appendChild(tag);
        }
        else if (type === "js") {
            tag = document.createElement("script");
            tag.type = "text/javascript";
            tag.src = url;
            self.popupDocument.body.appendChild(tag);
        }
        if (tag) {
            tag.onload = () => {
                resolve(url);
            };
            tag.onerror = () => {
                reject(url);
            };
        }
    })
        .catch((err) => {
        });
}

function setWidgetSetting(key, value) {
  chrome.runtime.sendMessage({ fn: 'setWidgetSetting', key: key, value: value, fromPopup: true });
}

function handleChangeSlider(setValued,sendResponse,  forceSet){
  var balls = self.popupDocument.getElementsByClassName('ejoy-slider-ball')
  var max = popupElements['speedSlider'].max
  var value = popupElements['speedSlider'].value
  if(forceSet){
      value = setValued;
      popupElements['speedSlider'].value = value
  }
  for(var i = 0; i < balls.length; i++){
      balls[balls.length - 1 -i].classList.remove("ejoy-active")
      if(max - (max /(balls.length + 1) * (balls.length -i)) < value){
          balls[balls.length - 1 -i].classList.add("ejoy-active")
      }
  }
  popupElements['fillBar'].style.height = value / max * 100 + 1 + '%'
  var bottom = (value / max * 100)
  if(bottom > 94){
      bottom = 94
  }
  var unit = popupElements['speedSlider'].max / 20;
  var speed = -10
  speed = Math.floor(speed + value / unit)
  if(speed > 9){
      speed = 9
  }
  if(speed < -9){
      speed = -9
  }
  if(sendResponse){
  debounce(setWidgetSetting('speed', speed));
  debounce(setWidgetSetting('speedDisplay', value));
  }

  popupElements['mileStoneIndicator'].style.bottom =  bottom + '%'
  popupElements['mileStoneIndicator'].textContent = value + 'WPM'
}

function bindUIEvents() {
  return new Promise((resolve) => {
    popupElements['speedSlider'].oninput = () => {
                handleChangeSlider(1, true, false);
            }
      resolve();
  });
}

function initElements() {
  return new Promise((resolve) => {
            for (let ele in elementIds) {
              popupElements[ele] = self.popupDocument.getElementById(elementIds[ele]);
            }
      resolve();
  })
      .catch((err) => {
      });
} 

function setPopupUI(request, sender, sendResponse) {
  let widgetSettings = null;
  return new Promise((resolve) => {
      chrome.runtime.sendMessage({fn: 'getWidgetSettings'}, async (_widgetSettings) => {
          widgetSettings = _widgetSettings;
          handleChangeSlider(widgetSettings.speedDisplay, false, true);
          resolve();
      });
    })
    .then(() => {
    })
    .catch((err) => {
    });
}

async function init() {
  try {
    await initElements();
      await bindUIEvents();
      await setPopupUI();
  } catch (err) {
  }
}

  async function frameContentOnLoad() {
    await loadResource(null, chrome.runtime.getURL('injected/ejoy-change-speed-popup/ejoy-change-speed-popup.css'));
    await init();
    self.isInjectingSD = false;
    self.hasPopup = true;
}

  function isAsyncFunction(fn) {
    if (self.asyncFunctions.includes(fn)) {
        return true;
    } else {
        return false;
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (self[request['fn']]) {
      self[request.fn](request, sender, sendResponse);
      if (self.isAsyncFunction(request.fn)) {
          return true;
      }
  }
  if (request.message === 'injectSpeedPoup') {
      injectSpeedPoup(request.value);
  }
});

}

function debounce(func, wait = 500, immediate = true) {
  var timeout;
  return function () {
      var context = this, args = arguments;
      var later = function () {
          timeout = null;
          if (!immediate)
              func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
  }
}

var ejoyChangeSpeedPopup = ejoyChangeSpeedPopup || new eJOYChangeSpeedPopup();

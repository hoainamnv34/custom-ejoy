function NRExtWidget() {
  const self = this;
  self.readerState = 'pause';
  self.frame = null;
  self.widgetDocument = null;
  self.hasWidget = false;
  self.isVoicesInit = false;
  self.showRSAlert = true;
  self.isRemember = true;
  self.mode = 'min';
  self.isInjectingWidget = false;
  self.isAsyncFunction = isAsyncFunction;
  self.asyncFunctions = ['getHasTextProcessor', 'getHasWidget', 'injectWidget'];
  self.getHasTextProcessor = getHasTextProcessor;
  self.getHasWidget = getHasWidget;
  self.injectWidget = injectWidget;
  self.setWidgetUI = setWidgetUI;
  self.toggleWidget = toggleWidget;
  self.voicesOnLoad = voicesOnLoad;
  self.displayRSAlert = displayRSAlert;
  self.getWidgetElements = getWidgetElements;
  self.setPresetAsSelectedVoice = setPresetAsSelectedVoice;
  self.setCCText = setCCText;
  self.btnLoginText = 'Log In';
  self.btnLogoutText = 'Log Out';
  self.btnSignupText = 'Sign Up';
  self.defaultEmail = 'user@naturalreaders.com';
  self.freeUserText = 'Free User';
  self.premUserText = 'Premium User';
  self.plusUserText = 'Plus User';
  self.eduPremUserText = 'Edu Premium Group User';
  self.loadingTimer = null;
  self.updateSpeedDisplay = updateSpeedDisplay;
  self.speedValue = 0;
  self.allCommands = {};
  const textElements = [
    {
      id: 'text_speak_menu',
      key: 'speak'
    },
    {
      id: 'text_speed_menu',
      key: 'speed'
    },
    {
      id: 'text_cc_menu',
      key: 'ccPanel'
    },
    {
      id: 'text_read_selection_menu',
      key: 'text_read_selection_menu'
    },
    {
      id: 'speaker_label',
      key: 'speak'
    },
    {
      id: 'free_voice_label',
      key: 'free_voice'
    },
    {
      id: 'preview-voice',
      key: 'preview_voice'
    },
    {
      id: 'preview-voice',
      key: 'preview_voice'
    },
    {
      id: 'text_voice_speed',
      key: 'voice_speed'
    },
    {
      id: 'preview-speed',
      key: 'preview_speed'
    },
    {
      id: 'text_cc_panel',
      key: 'text_cc_panel'
    },
    {
      id: 'text_read_bar',
      key: 'text_read_bar'
    },
    {
      id: 'text_show_cc_read_bar',
      key: 'text_show_cc_read_bar'
    },
    {
      id: 'text_no_show_cc_read_bar',
      key: 'text_no_show_cc_read_bar'
    },
    {
      id: 'text_text_highlight',
      key: 'text_text_highlight'
    },
    {
      id: 'text_text_highlight_desc',
      key: 'text_text_highlight_desc'
    },
    {
      id: 'text_sentence_word',
      key: 'text_sentence_word'
    },
    {
      id: 'text_sentence_only',
      key: 'text_sentence_only'
    },
    {
      id: 'text_word_only',
      key: 'text_word_only'
    },
    {
      id: 'text_none',
      key: 'text_none'
    },
    {
      id: 'text_highlight_color',
      key: 'text_highlight_color'
    },
    {
      id: 'text_color_light',
      key: 'text_color_light'
    },
    {
      id: 'text_color_dark',
      key: 'text_color_dark'
    },
    {
      id: 'text_color_ice',
      key: 'text_color_ice'
    },
    {
      id: 'text_color_warm',
      key: 'text_color_warm'
    },
    {
      id: 'text_dyslexia_fonts',
      key: 'text_dyslexia_fonts'
    },
    {
      id: 'text_dyslexia_fonts_desc',
      key: 'text_dyslexia_fonts_desc'
    },
    {
      id: 'text_auto_scroll_setting',
      key: 'text_auto_scroll_setting'
    },
    {
      id: 'text_auto_scroll_setting_desc',
      key: 'text_auto_scroll_setting_desc'
    },
    {
      id: 'text_select_text_and_read',
      key: 'text_select_text_and_read'
    },
    {
      id: 'text_show_read_icon',
      key: 'text_show_read_icon'
    },
    {
      id: 'text_only_when_selected',
      key: 'text_only_when_selected'
    },
    {
      id: 'text_10_char',
      key: 'text_10_char'
    },
    {
      id: 'text_20_char',
      key: 'text_20_char'
    },
    {
      id: 'text_40_char',
      key: 'text_40_char'
    },
    {
      id: 'text_60_char',
      key: 'text_60_char'
    },
    {
      id: 'text_80_char',
      key: 'text_80_char'
    },
    {
      id: 'text_100_char',
      key: 'text_100_char'
    },
    {
      id: 'text_read_selection_options',
      key: 'text_read_selection_options'
    },
    {
      id: 'text_when_using_read_selection',
      key: 'text_when_using_read_selection'
    },
    {
      id: 'text_read_to_page_end',
      key: 'text_read_to_page_end'
    },
    {
      id: 'text_only_read_selected',
      key: 'text_only_read_selected'
    },
    {
      id: 'text_hot_key_setting',
      key: 'text_hot_key_setting'
    },
    {
      id: 'text_edit_hotkey',
      key: 'text_edit_hotkey'
    },
    {
      id: 'text_click_edit_hot_key',
      key: 'text_click_edit_hot_key'
    },
    {
      id: 'text_edit_hot_key',
      key: 'text_edit_hot_key'
    },
    {
      id: 'text_shortcut_setting',
      key: 'text_shortcut_setting'
    },
    {
      id: 'hotkeys',
      key: 'hotkeys'
    },
    {
      id:'text_hotkey_menu',
      key:'text_hotkey_menu'
    },
    {
      id:'text_hot_key_change_speaker',
      key:'text_hot_key_change_speaker'
    },
    {
      id:'text_pressing',
      key:'text_pressing'
    },
    {
      id:'text_speaker_preset',
      key:'text_speaker_preset'
    },
    {
      id:'text_hot_key_cycle',
      key:'text_hot_key_cycle'
    },
    {
      id:'text_first_choice_speaker',
      key:'text_first_choice_speaker'
    },
    {
      id:'text_second_choice_speaker',
      key:'text_second_choice_speaker'
    },
    {
      id:'text_show_read_selection',
      key:'text_show_read_selection'
    },
  ];
  const widgetElements = {
    min: {},
    max: {}
  };
  const elementIds = {
    min: {
      container: 'minModeContainer',
      btnRead: 'read',
      animationRead: 'readAnimation',
      iconBtnRead: 'readIcon',
      btnForward: 'forward',
      btnBackward: 'rewind',
      btnMaxMode: 'btnMaxMode',
      btnRelocate: 'relocate',
      btnStop: 'stop',
      btnAdd: 'add',
      btnCloseStop: 'btnCloseStop',
      btnSettings: 'min-settings',
      centerAlert: 'nr-ext-min-center-alert',
      centerControls: 'nr-ext-min-center-controls',
      centerAlertYes: 'nr-rs-yes',
      centerAlertNo: 'nr-rs-no',
      centerAlertRemember: 'nr-rs-remember',
      progressCircle: 'nr-ext-min-progress-circle-outside',
      progress: 'nr-ext-min-progress-circle',
      changeSpeed: 'speed-reader',
      btnHelp:'btnHelp',
      btnReadContainer:'btn-read-min-container',
    },
    max: {
      container: 'maxModeContainer',
      btnCloseStop: 'bar-close',
      btnCloseMaxMode: 'bar-min',
      btnMenu: 'bar-menu',
      btnCloseMenu: 'max-close-menu',
      plusUpgrade: 'prem-plus-upgrade',
      menu: 'menu',
      btnRead: 'bar-read',
      btnStop: 'bar-stop',
      btnForward: 'bar-forward',
      btnBackward: 'bar-back',
      btnRelocate: 'bar-location',
      speakerMenu: 'nr-ext-max-menu-speaker',
      freeVoice: 'nr-ext-voice-free',
      premVoice: 'nr-ext-voice-prem',
      plusVoice: 'nr-ext-voice-plus',
      preset1Voice: 'nr-ext-voice-preset1',
      preset2Voice: 'nr-ext-voice-preset2',
      freeVoiceList: 'nr-ext-free-voice-list',
      premVoiceList: 'nr-ext-prem-voice-list',
      plusVoiceList: 'nr-ext-plus-voice-list',
      preset1VoiceList: 'nr-ext-preset1-voice-list',
      preset2VoiceList: 'nr-ext-preset2-voice-list',
      freeVoiceListMapper: 'nr-ext-free-voice-list-mapper',
      premVoiceListMapper: 'nr-ext-prem-voice-list-mapper',
      plusVoiceListMapper: 'nr-ext-plus-voice-list-mapper',
      preset1VoiceListMapper: 'nr-ext-preset1-voice-list-mapper',
      preset2VoiceListMapper: 'nr-ext-preset2-voice-list-mapper',
      ccDefault: 'nr-ext-cc-default',
      ccAbove: 'nr-ext-cc-above',
      ccNone: 'nr-ext-cc-no',
      readIconOn: 'nr-ext-read-selection',
      readSelectionOnly: 'nr-ext-read-selection-only',
      readToPageEnd: 'nr-ext-read-selection-to-end',
      curHighlightMode: 'nr-ext-settings-highlight-mode-current-text',
      highlightModeMenu: 'nr-ext-settings-highlight-mode-menu',
      curHighlightColourIcon: 'nr-ext-settings-highlight-color-current-icon',
      curHighlightColour: 'nr-ext-settings-highlight-color-current-text',
      highlightColourMenu: 'nr-ext-settings-highlight-color-menu',
      speedText: 'speedText',
      autoTrackText: 'nr-ext-auto-track-text',
      dyslexia: 'nr-ext-dyslexia',
      content: 'nr-ext-max-content',
      curCCMode: 'nr-ext-settings-cc-mode-current-text',
      ccModeMenu: 'nr-ext-settings-cc-mode-menu',
      btnLoginLogout: 'btnLoginLogout',
      btnSignup: 'btnSignup',
      userEmail: 'userEmail',
      userLicType: 'userLicType',
      btnContactUs: 'nr-ext-contact-us-btn',
      btnRateUs: 'nr-ext-rate-us-btn',
      btnConvert: 'nr-ext-convert-btn',
      centerAlert: 'nr-ext-max-bar-read-alert',
      centerCC: 'nr-ext-max-bar-textbox',
      centerAlertYes: 'nr-rs-max-yes',
      centerAlertNo: 'nr-rs-max-no',
      centerAlertRemember: 'nr-rs-max-remember',
      speedValue: 'speedSliderValueSender',
      readMaxValue: 'readSliderMaxSender',
      readValue: 'readSliderValueSender',
      btnUpload: 'nr-ext-upload-btn',
      menuContainer: 'nr-ext-max-menu-content',
      menuNav: 'nr-ext-max-menu-nav',
      ccText: 'nr-ext-max-bar-cc-text',
      btnPreviewSpeed: 'preview-speed',
      btnPreviewVoice: 'preview-voice',
      btnHotkeys: 'hotkeys',
      selectableCharLimit: 'nr-ext-readwords-menu',
      selectedCharLimit: 'selected-item',
      changeSpeed: 'speed-reader-max',
      speedSlider: 'ejoyRange',
      mileStoneIndicator: 'ejoy-mile-stone-indicator',
      btnAdd: 'add-max',
      btnReadContainer:'btn-read-max-container'
    }
  };
  const highlightMode = {
    all: {
      key: 'all',
      value: ['sentence', 'word'],
      text: 'sentence and word',
      keyMessage: 'text_sentence_word'
    },
    sentence: {
      key: 'sentence',
      value: ['sentence'],
      text: 'sentence only',
      keyMessage: 'text_sentence_only'
    },
    word: {
      key: 'word',
      value: ['word'],
      text: 'word only',
      keyMessage: 'text_word_only'
    },
    none: {
      key: 'none',
      value: [],
      text: 'none',
      keyMessage: 'text_none'
    }
  };
  const highlightColour = {
    light: {
      key: 'light',
      value: 'light',
      text: 'Light',
      keyMessage: 'text_color_light',
    },
    dark: {
      key: 'dark',
      value: 'dark',
      text: 'Dark',
      keyMessage: 'text_color_dark',
    },
    ice: {
      key: 'ice',
      value: 'ice',
      text: 'Ice',
      keyMessage: 'text_color_ice',
    },
    warm: {
      key: 'warm',
      value: 'warm',
      text: 'Warm',
      keyMessage: 'text_color_warm',
    }
  };
  const isShowReadingBar = false;
  const frameStyles = {
    min: {
      width: '353px',
      'max-width': '353px',
      'min-width': '353px',
      height: '120px',
      top: '12px',
      right: '12px',
      'box-shadow': 'none'
    },
    max: {
      width: '100%',
      'max-width': '100%',
      'min-width': '100%',
      height: '80px',
      bottom: '0',
      left: '0',
      'border-radius': '0',
      'box-shadow': 'rgba(0,0,0,0.3) 0px -3px 8px'
    },
    'max-controls': {
      'max-width': '100%',
      'min-width': '100%',
      width: '100%',
      height: '100%',
      bottom: '0',
      left: '0',
      'border-radius': '0',
      'box-shadow': 'rgba(0,0,0,0.3) 0px -3px 8px'
    },
    'max-cc-full': {
      width: '100%',
      'max-width': '100%',
      'min-width': '100%',
      height: '173px',
      bottom: '0',
      left: '0',
      'border-radius': '0',
      'box-shadow': 'rgba(0,0,0,0.3) 0px -3px 8px'
    },
    'max-cc-compact': {
      width: '100%',
      'max-width': '100%',
      'min-width': '100%',
      height: '80px',
      bottom: '0',
      left: '0',
      'border-radius': '0',
      'box-shadow': 'rgba(0,0,0,0.3) 0px -3px 8px'
    },
    'max-cc-none': {
      width: '100%',
      'max-width': '100%',
      'min-width': '100%',
      height: '80px',
      bottom: '0',
      left: '0',
      'border-radius': '0',
      'box-shadow': 'rgba(0,0,0,0.3) 0px -3px 8px'
    },
    'pdf-bar': {
      width: '120px',
      height: '60px',
      top: '120px',
      right: '26px',
      'border-radius': '24px 0 0 24px',
      'box-shadow': 'none'
    }
  };
  const controls = ['menu'];
  let curCCMode = 'max-cc-compact';
  let isAutoScroll = true;
  const isDyslexic = false;
  const ccMode = {
    'max-cc-full': {
      key: 'max-cc-full',
      value: 'max-cc-full',
      text: 'Show CC panel above the reading bar',
      class: 'nr-ext-cc-above',
      keyMessage: 'text_show_cc_above_read_bar'
    },
    'max-cc-compact': {
      key: 'max-cc-compact',
      value: 'max-cc-compact',
      text: 'Show CC panel in the reading bar',
      class: '',
      keyMessage: 'text_show_cc_read_bar'
    },
    'max-cc-none': {
      key: 'max-cc-none',
      value: 'max-cc-none',
      text: "Don't show CC panel",
      class: 'nr-ext-cc-no',
      keyMessage: 'text_no_show_cc_read_bar'
    }
  };
  const settingsCardMarginTop = 16;
  const settingsCardMarginBottom = 40;
  let over = false;
  let rewindDecelerateTimer;
  let forwardDecelerateTimer;
  let readOption = 'all';
  let curCircleProgress = 0;
  function mobileAndTabletcheck() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; }(navigator.userAgent || navigator.vendor || window.opera));
    return check;
  }
  async function init() {
    try {
      chrome.runtime.sendMessage({fn: "getAllCommand"}, function(response) {
        let allCommands = {};
        response.map(command => {
          allCommands[command.name] = command.shortcut
        })
        self.allCommands = allCommands;
        initTooltip(widgetElements.min.btnForward, 'top', chrome.i18n.getMessage("nextSentenceTooltip") + (self.allCommands['forward'] ? ' (' + self.allCommands['forward'] +')' : ''));
        initTooltip(widgetElements.min.btnBackward, 'top', chrome.i18n.getMessage("previousSentenceTooltip") + (self.allCommands['rewind'] ? ' (' + self.allCommands['rewind'] +')' : ''));
        initTooltip(widgetElements.max.btnForward, 'top', chrome.i18n.getMessage("nextSentenceTooltip") + (self.allCommands['forward'] ? ' (' + self.allCommands['forward'] +')' : ''));
        initTooltip(widgetElements.max.btnBackward, 'top', chrome.i18n.getMessage("previousSentenceTooltip") + (self.allCommands['rewind'] ? ' (' + self.allCommands['rewind'] +')' : ''));
        initTooltip(widgetElements.min.btnReadContainer,'top', chrome.i18n.getMessage("playPauseTooltip") + (self.allCommands['play'] ? ' (' + self.allCommands['play'] +')' : ''));
        initTooltip(widgetElements.max.btnReadContainer,'top', chrome.i18n.getMessage("playPauseTooltip") + (self.allCommands['play'] ? ' (' + self.allCommands['play'] +')' : ''));
      });
      await initWidgetElements();
      await bindUIEvents();
      await setWidgetUI();
      await setTextUI();
      if (!self.isVoicesInit) {
        await setUIVoiceLists();
      }
    } catch (err) {
    }
  }
  function setText(ele, key) {
    const text = chrome.i18n.getMessage(key);
    if (text) {
      ele.innerText = text;
    }
  }
  function setTextUI() {
    for (const i in textElements) {
      const text = textElements[i];
      if (text) {
        const ele = self.widgetDocument.getElementById(text.id);
        if (ele) {
          setText(ele, text.key);
        }
      }
    }
  }
  function initWidgetElements() {
    return new Promise((resolve) => {
      for (const mode in elementIds) {
        for (const ele in elementIds[mode]) {
          widgetElements[mode][ele] = self.widgetDocument.getElementById(elementIds[mode][ele]);
        }
      }
      resolve();
    })
            .catch((err) => {
            });
  }
  function updateSpeedDisplay(request, sender, sendResponse) {
    if (request.fromPopup) {
      handleChangeSlider(request.value, false, true);
    }
  }
  function loadResources(urls) {
    const promises = [];
    for (let i = 0; i < urls.length; i++) {
      promises.push(loadResource(null, chrome.runtime.getURL(urls[i])));
    }
    return Promise.all(promises)
            .catch((err) => {
            });
  }
  function loadResource(type, url) {
    return new Promise((resolve, reject) => {
      let tag;
      if (!type) {
        const match = url.match(/\.([^.]+)$/);
        if (match) {
          type = match[1];
        }
      }
      if (!type) {
        type = 'js';
      }
      if (type === 'css') {
        tag = document.createElement('link');
        tag.type = 'text/css';
        tag.rel = 'stylesheet';
        tag.href = url;
        self.widgetDocument.head.appendChild(tag);
      } else if (type === 'js') {
        tag = document.createElement('script');
        tag.type = 'text/javascript';
        tag.src = url;
        self.widgetDocument.body.appendChild(tag);
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
  function displayRSAlert() {
    if (self.showRSAlert) {
      if (self.mode == 'min') {
        widgetElements.min.centerControls.style.display = 'none';
        widgetElements.min.centerAlert.style.display = 'block';
      } else {
        widgetElements.max.centerCC.style.display = 'none';
        widgetElements.max.centerAlert.style.display = 'block';
      }
    }
  }
  function dismissRSAlert() {
    if (self.mode == 'min') {
      widgetElements.min.centerAlert.style.display = 'none';
      widgetElements.min.centerControls.style.display = 'flex';
    } else {
      widgetElements.max.centerAlert.style.display = 'none';
      widgetElements.max.centerCC.style.display = 'block';
    }
  }
  function setWidgetUI(request, sender, sendResponse) {
    let widgetSettings = null;

    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ fn: 'getWidgetSettings' }, async (_widgetSettings) => {
        widgetSettings = _widgetSettings;
        await setMode(widgetSettings.mode);
        setUICCMode(widgetSettings.ccMode);
        self.readerState = widgetSettings.readerState;
                // setUserUI(widgetSettings.userInfo, widgetSettings.loggedIn);
        if (widgetElements.max[`${widgetSettings.voiceType}Voice`]) {
          widgetElements.max[`${widgetSettings.voiceType}Voice`].checked = true;
        }
        updateUIDropdownCurrentText(widgetElements.max.curCCMode, chrome.i18n.getMessage(ccMode[curCCMode].keyMessage));
        setUISelectedDropdownItemByValue(widgetElements.max.ccModeMenu, ccMode[curCCMode].key);
        let mode = highlightMode.none;
        if (widgetSettings.beHighlighted.length > 0) {
          if (widgetSettings.beHighlighted.length > 1) {
            mode = highlightMode.all;
          } else {
            mode = highlightMode[widgetSettings.beHighlighted[0]];
          }
        }
        updateUIDropdownCurrentText(widgetElements.max.curHighlightMode, chrome.i18n.getMessage(mode.keyMessage));
        setUISelectedDropdownItemByValue(widgetElements.max.highlightModeMenu, mode.key);
        let colour = highlightColour.light;
        for (const _colour in highlightColour) {
          if (highlightColour[_colour].value == widgetSettings.highlightColour) {
            colour = highlightColour[_colour];
            break;
          }
        }
        updateUIDropdownCurrentText(widgetElements.max.curHighlightColour, chrome.i18n.getMessage(colour.keyMessage));
        updateUIDropdownCurrentHighlightColourIcon(widgetElements.max.curHighlightColourIcon, 'nr-ext-color-', colour.value);
        setUISelectedDropdownItemByValue(widgetElements.max.highlightColourMenu, colour.key);
        initTooltip(widgetElements.max.btnRelocate, 'right', `${chrome.i18n.getMessage('Auto_scroll')} ${widgetSettings.isAutoScroll ? 'OFF' : 'ON'}`);
        initTooltip(widgetElements.min.btnRelocate, 'left', `${chrome.i18n.getMessage('Auto_scroll')} ${+(widgetSettings.isAutoScroll ? 'OFF' : 'ON')}`);
        isAutoScroll = widgetSettings.isAutoScroll;
        setAutoScrollUI(isAutoScroll);
        // setDyslexiaToggle(widgetSettings.isDyslexic);
        if (!self.isVoicesInit) {
          await setUIVoiceLists();
        } else {
          const activeSpeakerTabButton = widgetElements.max[`${widgetSettings.voiceType}Voice`];
          const ev = new Event('click');
          activeSpeakerTabButton.dispatchEvent(ev);
          invokeVoiceListOnChangeEvent(widgetElements.max.preset1VoiceListMapper, widgetSettings.preset1Voice);
          invokeVoiceListOnChangeEvent(widgetElements.max.preset2VoiceListMapper, widgetSettings.preset2Voice);
        }
        setSpeedSliderValue(widgetSettings.speed, false);
        setReadIcon(widgetSettings.readIcon);
        setReadToEndIcon(widgetSettings.readSelectionOption);
        setShowRSAlert(widgetSettings.showReadSelectionToPageEndOption);
        setCharSelection(widgetSettings.LimitedReadSelectionCharAmount);
        setReaderUI();
        handleChangeSlider(widgetSettings.speedDisplay, false, true);
        resolve();
      });
    })
            .then(() => {
              if (widgetSettings.isVisible) {
                if (request && ((request.beingReadTabId && request.beingReadTabId === request.tabId && request.activeTabId === request.tabId) ||
                        (!request.beingReadTabId && request.tabId && request.activeTabId === request.tabId))) {
                  self.frame.style.display = 'block';
                } else {
                  self.frame.style.display = 'none';
                }
              } else {
                self.frame.style.display = 'none';
              }
            })
            .catch((err) => {
            });
  }
  function setReadIcon(readIcon) {
        if (readIcon) {
            widgetElements['max']['readIconOn'].checked = true;
        } else {
            widgetElements['max']['readIconOn'].checked = false;
        }
    if (nrSelectionDetector != undefined) {
      nrSelectionDetector.switchIcon(readIcon);
    }
  }
  function setReadToEndIcon(readIcon) {
    if (readIcon == 'selection-to-page-end') {
      widgetElements.max.readToPageEnd.checked = true;
    } else {
      widgetElements.max.readSelectionOnly.checked = true;
    }
  }
  function setShowRSAlert(bool) {
    self.showRSAlert = bool;
  }
  function setCharSelection(charLimit) {
    const charLimitString = `${charLimit} ${chrome.i18n.getMessage('text_characters')}`;
    widgetElements.max.selectedCharLimit.innerText = charLimitString;
  }
  function setUIVoiceLists() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ fn: 'getIsSettingVoices' }, (isSettingVoices) => {
        if (!isSettingVoices) {
          setUIFreeVoiceList();
                    // setUIPremVoiceList();
                    // setUIPlusVoiceList();
          setUIPresetVoiceLists();
          self.isVoicesInit = true;
        }
        resolve();
      });
    })
            .catch(err => {
            });
  }
  function setUIPresetVoiceLists() {
    chrome.runtime.sendMessage({ fn: 'getVoices', type: 'all' }, (voices) => {
      populateVoiceList('preset1VoiceList', voices);
      populateVoiceList('preset2VoiceList', voices);
    });
  }
  function setUIFreeVoiceList() {
    chrome.runtime.sendMessage({ fn: 'getVoices', type: 'free' }, (freeVoices) => {
      populateVoiceList('freeVoiceList', freeVoices);
    });
  }
  function setUIPremVoiceList() {
    chrome.runtime.sendMessage({ fn: 'getVoices', type: 'prem' }, (premVoices) => {
      populateVoiceList('premVoiceList', premVoices);
    });
  }
  function setUIPlusVoiceList() {
    chrome.runtime.sendMessage({ fn: 'getVoices', type: 'plus' }, (plusVoices) => {
      populateVoiceList('plusVoiceList', plusVoices);
    });
  }
  function populateVoiceList(target, voices) {
    const voiceItemsTarget = target;
    const voiceListMapperTarget = `${target}Mapper`;

    populateVoiceItems(voiceItemsTarget, voices);
    populateVoiceListMapper(voiceListMapperTarget, voices);
    let widgetSettings = null;
    chrome.runtime.sendMessage({ fn: 'getWidgetSettings' }, async (_widgetSettings) => {
      widgetSettings = _widgetSettings;
      if (voiceListMapperTarget == `${widgetSettings.voiceType}VoiceListMapper`) {
        invokeVoiceListOnChangeEvent(widgetElements.max[`${widgetSettings.voiceType}VoiceListMapper`], widgetSettings[`${widgetSettings.voiceType}Voice`]);
      }
      if (voiceListMapperTarget == 'preset1VoiceListMapper') {
        invokeVoiceListOnChangeEvent(widgetElements.max.preset1VoiceListMapper, widgetSettings.preset1Voice);
      }
      if (voiceListMapperTarget == 'preset2VoiceListMapper') {
        invokeVoiceListOnChangeEvent(widgetElements.max.preset2VoiceListMapper, widgetSettings.preset2Voice);
      }
    });
  }
  function populateVoiceItems(target, voices) {
    const voiceMenu = widgetElements.max[target];
    voiceMenu.innerHTML = '';
    for (const voice in voices) {
      if (target.includes('free') && voices[voice].isPrem) {
        continue;
      }
      const divVoiceName = document.createElement('div');
      divVoiceName.classList.add('nr-ext-speaker-name');
      divVoiceName.innerText = `${getLanguageName(voices[voice].language)} - ${voices[voice].name}`;
      const divVoiceItem = document.createElement('div');
      divVoiceItem.classList.add('nr-ext-speaker-menu-list-item');
      if (target.includes('preset')) {
        const divVoiceTypeName = document.createElement('div');
        divVoiceTypeName.innerText = voices[voice].type === 'free' ? chrome.i18n.getMessage("free_voice_preset") : (voices[voice].type === 'prem' ? chrome.i18n.getMessage("premium_voice_preset") : chrome.i18n.getMessage("plus_voice_preset"));
        divVoiceItem.appendChild(divVoiceTypeName);
      }
      if (!target.includes('preset')) {
        const imgFlag = document.createElement('div');
        const flagClass = matchFlagWithLocale(voices[voice].language);
        if (flagClass !== 'country-Unknow') {
          imgFlag.classList.add('nr-sprite');
        }
        imgFlag.classList.add(flagClass);
        divVoiceItem.appendChild(imgFlag);
      }
      divVoiceItem.appendChild(divVoiceName);
      const liVoiceItem = document.createElement('li');
      liVoiceItem.appendChild(divVoiceItem);
      if (target.includes('preset')) {
        liVoiceItem.setAttribute('voiceType', voices[voice].type);
        liVoiceItem.setAttribute('isPreset', true);
      }
      liVoiceItem.setAttribute('value', voices[voice].key);
      voiceMenu.appendChild(liVoiceItem);
    }
    generateDropdownItemsClickEvent(voiceMenu, selectVoiceItem);
  }
  function populateVoiceListMapper(mapper, voices) {
    const voiceListSelect = widgetElements.max[mapper];
    voiceListSelect.options.length = 0;
    for (const voice in voices) {
      if (mapper.includes('free') && voices[voice].isPrem) {
        continue;
      }
      const option = document.createElement('option');
      option.text = voices[voice].key;
      option.value = voices[voice].key;
      voiceListSelect.add(option);
    }
    voiceListSelect.onchange = debounce(changeVoice);
  }
  function getLanguageName(lang) {
    switch (lang) {
      case 'en-US':
        return 'English (US)';
      case 'en-GB':
        return 'English (UK)';
      case 'en-UK':
        return 'English (UK)';
      case 'en-CY':
        return 'English (Wales)';
      case 'en-AU':
        return 'English (Australia)';
      case 'en-IN':
        return 'English (India)';
      case 'es-ES':
        return 'Spanish (Spain)';
      case 'es-MX':
        return 'Spanish (Mexico)';
      case 'es-CA':
        return 'Spanish (Spain)';
      case 'de-DE':
        return 'German';
      case 'fr-FR':
        return 'French';
      case 'es-US':
        return 'Spanish (US)';
      case 'it-IT':
        return 'Italian';
      case 'pl-PL':
        return 'Polish';
      case 'nl-NL':
        return 'Dutch';
      case 'tr-TR':
        return 'Turkish';
      case 'no-NO':
        return 'Norwegian';
      case 'nb-NO':
        return 'Norwegian';
      case 'is-IS':
        return 'Icelandic';
      case 'da-DK':
        return 'Danish';
      case 'cy-GB':
        return 'Welsh';
      case 'zh-CN':
        return 'Chinese';
      case 'zh-TW':
        return 'Chinese (Taiwan)';
      case 'zh-HK':
        return 'Chinese (Hong Kong)';
      case 'ja-JP':
        return 'Japanese';
      case 'ko-KR':
        return 'Korean';
      case 'hi-HI':
        return 'Hindi';
      case 'id-ID':
        return 'Indonesian';
      case 'ro-RO':
        return 'Romanian';
      case 'ru-RU':
        return 'Russian';
      case 'pt-BR':
        return 'Portuguese (Brazil)';
      case 'pt-PT':
        return 'Portuguese (Portugal)';
      case 'fr-CA':
        return 'French (Canada)';
      case 'sv-SE':
        return 'Swedish';
      default:
        return lang;
    }
  }
  function selectVoiceItem(e) {
    const voice = this.getAttribute('value');
    const isPreset = this.getAttribute('isPreset');
    let element;
    switch (this.parentElement.id) {
      case elementIds.max.freeVoiceList: {
        element = widgetElements.max.freeVoiceListMapper;
        break;
      }
            // case elementIds['max']['premVoiceList']: {
            //     element = widgetElements['max']['premVoiceListMapper'];
            //     break;
            // }
      case elementIds.max.plusVoiceList: {
        element = widgetElements.max.plusVoiceListMapper;
        break;
      }
      case elementIds.max.preset1VoiceList: {
        element = widgetElements.max.preset1VoiceListMapper;
        break;
      }
      case elementIds.max.preset2VoiceList: {
        element = widgetElements.max.preset2VoiceListMapper;
        break;
      }
      default: {
        element = widgetElements.max.freeVoiceListMapper;
      }
    }
    if (isPreset) {
      if (this.parentElement.id.includes('preset1')) {
        widgetElements.max.preset1Voice.textContent = this.textContent;
      } else if (this.parentElement.id.includes('preset2')) {
        widgetElements.max.preset2Voice.textContent = this.textContent;
      }
    }
    invokeVoiceListOnChangeEvent(element, voice);
  }
  function setPresetAsSelectedVoice(request, sender, sendResponse) {
    const presetIndex = request.index;
    const presetMenu = widgetElements.max[`preset${presetIndex}VoiceList`];
    const voiceItems = presetMenu.querySelectorAll('li');
    const selectedIndex = widgetElements.max[`preset${presetIndex}VoiceListMapper`].selectedIndex;
    const voice = voiceItems[selectedIndex];
    const voiceType = voice.getAttribute('voiceType');
    const value = voice.getAttribute('value');
    const voiceListMapperToChange = widgetElements.max[`${voiceType}VoiceListMapper`];
    invokeVoiceListOnChangeEvent(voiceListMapperToChange, value);
    widgetElements.max[`${voiceType}Voice`].checked = true;
    const activeSpeakerTabButton = widgetElements.max[`${voiceType}Voice`];
    const ev = new Event('click');
    activeSpeakerTabButton.dispatchEvent(ev);
  }
  function changeVoice(e) {
    let voiceType = '';
    if (e.target.id.includes('plus')) {
      voiceType = 'plus';
    } else if (e.target.id.includes('prem')) {
      voiceType = 'prem';
    } else if (e.target.id.includes('preset1')) {
      voiceType = 'preset1';
    } else if (e.target.id.includes('preset2')) {
      voiceType = 'preset2';
    } else {
      voiceType = 'free';
    }
    if (voiceType) {
      setWidgetSetting(`${voiceType}Voice`, e.target.value);
    }
    let voiceMenu;
    switch (e.target.id) {
      case elementIds.max.freeVoiceListMapper: {
        voiceMenu = widgetElements.max.freeVoiceList;
        break;
      }
            // case elementIds['max']['premVoiceListMapper']: {
            //     voiceMenu = widgetElements['max']['premVoiceList'];
            //     break;
            // }
            // case elementIds['max']['plusVoiceListMapper']: {
            //     voiceMenu = widgetElements['max']['plusVoiceList'];
            //     break;
            // }
      case elementIds['max']['preset1VoiceListMapper']: {
          voiceMenu = widgetElements['max']['preset1VoiceList'];
          break;
      }
      case elementIds['max']['preset2VoiceListMapper']: {
          voiceMenu = widgetElements['max']['preset2VoiceList'];
          break;
      }
      default: {
        voiceMenu = widgetElements.max.freeVoiceList;
      }
    }
    const voiceItems = voiceMenu.querySelectorAll('li');
    try {
      const isPreset = JSON.parse(voiceItems[e.target.selectedIndex].getAttribute('isPreset'));
      if (isPreset) {
        if (e.target.id.includes('preset1')) {
          widgetElements.max.preset1Voice.textContent = voiceItems[e.target.selectedIndex].textContent;
        } else if (e.target.id.includes('preset2')) {
          widgetElements.max.preset2Voice.textContent = voiceItems[e.target.selectedIndex].textContent;
        }
      }
    } catch (err) {
    }
    if(voiceItems.length){
      setUISelectedDropdownItem(voiceItems[e.target.selectedIndex] || voiceItems[0]);
    }
  }
  function invokeVoiceListOnChangeEvent(target, value) {
    const element = target;
    if (element !== null) {
      const ev = new Event('change');
      if (value !== null) {
        element.value = value;
      }
      element.dispatchEvent(ev);
    }
  }
  function matchFlagWithLocale(locale) {
    let src;
    switch (locale) {
      case 'en-US':
        src = 'en-US';
        break;
      case 'en-GB':
        src = 'en-GB';
        break;
      case 'en-AU':
        src = 'en-AU';
        break;
      case 'en-GB-WLS':
        src = 'en-GB-WLS';
        break;
      case 'en-IN':
        src = 'en-IN';
        break;
      case 'en-CY':
        src = 'en-GB-WLS';
        break;
      case 'es-US':
        src = 'en-US';
        break;
      case 'es-CA':
        src = 'es-ES';
        break;
      case 'es-ES':
        src = 'es-ES';
        break;
      case 'tr-TR':
        src = 'tr-TR';
        break;
      case 'sv-SE':
        src = 'sv-SE';
        break;
      case 'ru-RU':
        src = 'ru-RU';
        break;
      case 'ro-RO':
        src = 'ro-RO';
        break;
      case 'pt-PT':
        src = 'pt-PT';
        break;
      case 'pt-BR':
        src = 'pt-BR';
        break;
      case 'pl-PL':
        src = 'pl-PL';
        break;
      case 'nl-NL':
        src = 'nl-NL';
        break;
      case 'nb-NO':
        src = 'no-NO';
        break;
      case 'no-NO':
        src = 'no-NO';
        break;
      case 'ko-KR':
        src = 'ko-KR';
        break;
      case 'ja-JP':
        src = 'ja-JP';
        break;
      case 'it-IT':
        src = 'it-IT';
        break;
      case 'is-IS':
        src = 'is-IS';
        break;
      case 'fr-FR':
        src = 'fr-FR';
        break;
      case 'fr-CA':
        src = 'fr-CA';
        break;
      case 'de-DE':
        src = 'de-DE';
        break;
      case 'da-DK':
        src = 'da-DK';
        break;
      case 'cy-GB':
        src = 'en-GB-WLS';
        break;
      default:
        src = 'country-Unknow';
    }
    return src;
  }
  function setWidgetSetting(key, value) {
    chrome.runtime.sendMessage({ fn: 'setWidgetSetting', key, value, fromPopup: false });
  }
  function updateUICurrentVoice(voiceType, voiceKey) {
    widgetElements.max.curSpeaker.innerText = voiceKey.substring(0, voiceKey.lastIndexOf(' '));
  }
  function updateUIDropdownCurrentText(dropdownDisplayItem, curText) {
    if (dropdownDisplayItem) {
      dropdownDisplayItem.innerText = curText;
    }
  }
  function handleChangeSlider(setValued, updateWidgetSetting, forceSet) {
    const balls = self.widgetDocument.getElementsByClassName('ejoy-slider-ball');
    const max = widgetElements.max.speedSlider.max;
    let value = widgetElements.max.speedSlider.value;
    if (forceSet) {
      value = setValued;
    }
    for (let i = 0; i < balls.length; i++) {
      balls[balls.length - 1 - i].classList.remove('ejoy-active');
      if (max - (max / (balls.length + 1) * (balls.length - i)) < value) {
        balls[balls.length - 1 - i].classList.add('ejoy-active');
      }
    }
    let bottom = (value / max * 100);
    if (bottom > 94) {
      bottom = 94;
    }
    const unit = widgetElements.max.speedSlider.max / 20;
    let speed = -10;
    speed = Math.floor(speed + value / unit);
    if (speed > 9) {
      speed = 9;
    }
    if (speed < -9) {
      speed = -9;
    }
    setSpeedSliderValue(speed, false);
    if (updateWidgetSetting) {
      debounce(setWidgetSetting('speed', speed));
      debounce(setWidgetSetting('speedDisplay', value));
    }
    widgetElements.max.speedSlider.value = value;
    widgetElements.max.speedText.textContent = `${value}WPM`;
  }
  function bindUIEvents() {
    return new Promise((resolve) => {
      widgetElements.min.btnRead.onclick = () => {
        if (self.readerState === 'pause') {
          chrome.runtime.sendMessage({ fn: 'closePopupWhenClickPlay' });
          if (nrSelectionDetector.hasSelectionOnPage()) {
            readSelection();
          } else {
            chrome.runtime.sendMessage({ fn: 'play' });
          }
        } else {
          chrome.runtime.sendMessage({ fn: 'pause' });
          if (widgetElements.min.btnStop) {
            widgetElements.min.btnStop.style.display = 'inline-block';
          }
          if (widgetElements.max.btnStop) {
                        // widgetElements['max']['btnStop'].style.display = 'inline-block';
            widgetElements.max.btnStop.style.visibility = 'visible';
          }
        }
      };
      widgetElements.min.btnAdd.onclick = () => {
        window.open(' https://ejoy-english.com/blog/vi/ejoy-extension-upcoming-features/');
      };
      widgetElements.max.btnAdd.onclick = () => {
        window.open(' https://ejoy-english.com/blog/vi/ejoy-extension-upcoming-features/');
      };
      widgetElements.min.changeSpeed.onclick = () => {
        ejoyChangeSpeedPopup.showHide(true);
        const position = self.frame.getBoundingClientRect();
        ejoyChangeSpeedPopup.setPositionTop(position.bottom, position.left);
      };
      widgetElements.max.changeSpeed.onclick = () => {
        ejoyChangeSpeedPopup.showHide(true);
        const position = self.frame.getBoundingClientRect();
        ejoyChangeSpeedPopup.setPositionBottom(position.top, position.left);
      };
      widgetElements.max.speedSlider.oninput = () => {
        handleChangeSlider(1, true, false);
      };
      widgetElements.min.btnHelp.onclick = () => {
        window.open('https://ejo.bz/audio-reader');
      };
      widgetElements.max.btnRead.onclick = () => {
        setUIOnLoading();
        if (self.readerState === 'pause') {
          chrome.runtime.sendMessage({ fn: 'closePopupWhenClickPlay' });
          if (nrSelectionDetector.hasSelectionOnPage()) {
            readSelection();
          } else {
            chrome.runtime.sendMessage({ fn: 'play' });
          }
        } else {
          chrome.runtime.sendMessage({ fn: 'pause' });
          if (widgetElements.min.btnStop) {
            widgetElements.min.btnStop.style.display = 'inline-block';
          }
          if (widgetElements.max.btnStop) {
                        // widgetElements['max']['btnStop'].style.display = 'inline-block';
            widgetElements.max.btnStop.style.visibility = 'visible';
          }
        }
      };
      initTooltip(widgetElements.max.btnStop, 'right', chrome.i18n.getMessage("stopReaderTooltip"));
      initTooltip(widgetElements.min.btnStop, 'right', chrome.i18n.getMessage("stopReaderTooltip") );
      // initTooltip(widgetElements.min.btnForward, 'top', chrome.i18n.getMessage("nextSentenceTooltip") );
      // initTooltip(widgetElements.min.btnBackward, 'top', chrome.i18n.getMessage("previousSentenceTooltip"));
      initTooltip(widgetElements.min.changeSpeed, 'top', chrome.i18n.getMessage("readingSpeedTooltip"));
      initTooltip(widgetElements.min.btnMaxMode, 'left', chrome.i18n.getMessage("switchControlBarTooltip"));
      initTooltip(widgetElements.min.btnSettings, 'top', chrome.i18n.getMessage("settingTooltip"));
      // initTooltip(widgetElements.max.btnForward, 'top', chrome.i18n.getMessage("nextSentenceTooltip"));
      // initTooltip(widgetElements.max.btnBackward, 'top', chrome.i18n.getMessage("previousSentenceTooltip"));
      initTooltip(widgetElements.max.changeSpeed, 'top', chrome.i18n.getMessage("readingSpeedTooltip"));
      initTooltip(widgetElements.max.btnCloseMaxMode, 'top', chrome.i18n.getMessage("zoomInTooltip"));
      initTooltip(widgetElements.max.btnMenu, 'top', chrome.i18n.getMessage("settingTooltip"));
      initTooltip(widgetElements.min.btnHelp, 'left', chrome.i18n.getMessage("helpTooltip"));
      // initTooltip(widgetElements.min.btnReadContainer,'top', chrome.i18n.getMessage("playPauseTooltip"));
      // initTooltip(widgetElements.max.btnReadContainer,'top', chrome.i18n.getMessage("playPauseTooltip"));
      widgetElements.min.btnForward.onclick = () => {
        forward();
      };
      widgetElements.max.btnForward.onclick = () => {
        forward();
      };
      widgetElements.min.btnBackward.onclick = () => {
        rewind();
      };
      widgetElements.max.btnBackward.onclick = () => {
        rewind();
      };
      widgetElements.min.btnStop.onclick = () => {
        chrome.runtime.sendMessage({ fn: 'stop' });
      };
      widgetElements.max.btnStop.onclick = () => {
        chrome.runtime.sendMessage({ fn: 'stop' });
      };
      widgetElements.min.btnMaxMode.onclick = () => {
        setMode('max', false);
      };
      widgetElements.max.btnCloseMaxMode.onclick = () => {
        setMode('min', false);
      };
      widgetElements.min.btnCloseStop.onclick = () => {
        toggleWidget();
        ejoyChangeSpeedPopup.setShowHide(false);
        chrome.runtime.sendMessage({ fn: 'stop' });
      };
      widgetElements.max.btnCloseStop.onclick = () => {
        toggleWidget();
        chrome.runtime.sendMessage({ fn: 'stop' });
      };
      widgetElements.max.btnMenu.onclick = () => {
        toggleMaxControl('menu');
      };
            //
      widgetElements.max.btnCloseMenu.onclick = () => {
        toggleMaxControl('menu');
      };
            //
      widgetElements.max.menuContainer.onscroll = (e) => {
        updateMenuNavLinkStyle();
      };
            // widgetElements['max']['speedValue'].onchange = () => {
            //     setWidgetSetting('speed', widgetElements['max']['speedValue'].value);
            // }
      widgetElements.max.readValue.onchange = debounce(() => {
        const _readValue = JSON.parse(widgetElements.max.readValue.value);
        if (_readValue.tag !== 'nr-ext-widget') {
          if (_readValue.lastModified === 'page') {
            chrome.runtime.sendMessage({ fn: 'readIndex', pageIndex: _readValue.pageIndex, percentage: _readValue.percentage });
          } else {
            chrome.runtime.sendMessage({ fn: 'readIndex', index: _readValue.sentenceIndex });
          }
        }
        if (widgetElements.max.readMaxValue.value) {
          const _maxValue = JSON.parse(widgetElements.max.readMaxValue.value);
          let percentage = _readValue.value * 100 / (_maxValue.max + 1);
          if (isNaN(percentage)) {
            percentage = 0;
          }
          setUICurrBeingRead(percentage);
        }
      });
      widgetElements.min.progressCircle.onclick = setTriggerCircleReadProgress;
      widgetElements.max.autoTrackText.onclick = () => {
        setLocateToggle(widgetElements.max.autoTrackText.checked);
      };
            // widgetElements['max']['dyslexia'].onclick = () => {
            //     setDyslexiaToggle(widgetElements['max']['dyslexia'].checked);
            // }
      widgetElements.min.btnRelocate.onclick = () => {
        setLocateToggle(!isAutoScroll);
      };
      widgetElements.max.btnRelocate.onclick = () => {
        setLocateToggle(!isAutoScroll);
      };
            // widgetElements['max']['btnContactUs'].onclick = () => {
            //     window.open('https://www.naturalreaders.com/about.html#contactus', '_blank');
            // }
            // widgetElements['max']['btnRateUs'].onclick = () => {
            //     window.open('https://chrome.google.com/webstore/detail/natural-reader-text-to-sp/kohfgcgbkjodfcfkcackpagifgbcmimk');
            // }
            // widgetElements['max']['btnUpload'].onclick = () => {
            //     window.open('https://www.naturalreaders.com/online/?action=upload', '_blank');
            // }
            // widgetElements['max']['btnConvert'].onclick = () => {
            //     chrome.runtime.sendMessage({fn: 'onConvertBtnClicked'});
            // }
      widgetElements.max.freeVoice.onclick = () => {
        setWidgetSetting('voiceType', 'free');
        chrome.runtime.sendMessage({ fn: 'getWidgetSettings' }, (widgetSettings) => {
          invokeVoiceListOnChangeEvent(widgetElements.max.freeVoiceListMapper, widgetSettings.freeVoice);
        });
      };
            // widgetElements['max']['premVoice'].onclick = () => {
            //     setWidgetSetting('voiceType', 'prem');
            //     chrome.runtime.sendMessage({fn: 'getWidgetSettings'}, function(widgetSettings) {
            //         invokeVoiceListOnChangeEvent(widgetElements['max']['premVoiceListMapper'], widgetSettings.premVoice);
            //     });
            // }
            // widgetElements['max']['plusVoice'].onclick = () => {
            //     setWidgetSetting('voiceType', 'plus');
            //     chrome.runtime.sendMessage({fn: 'getWidgetSettings'}, function(widgetSettings) {
            //         invokeVoiceListOnChangeEvent(widgetElements['max']['plusVoiceListMapper'], widgetSettings.plusVoice);
            //     });
            // }
            widgetElements['max']['readIconOn'].onclick = () => {
                let checked = widgetElements['max']['readIconOn'].checked;
                setWidgetSetting('readIcon', checked);
                if (nrSelectionDetector != undefined) {
                    nrSelectionDetector.switchIcon(checked);
                }
            }
      widgetElements.max.readSelectionOnly.onclick = () => {
        setWidgetSetting('readSelectionOption', 'selection');
      };
      widgetElements.max.readToPageEnd.onclick = () => {
        setWidgetSetting('readSelectionOption', 'selection-to-page-end');
      };
      widgetElements.min.btnSettings.onclick = () => {
        toggleMaxControl('menu');
      };
            // widgetElements['max']['btnLoginLogout'].onclick = () => {
            //     chrome.runtime.sendMessage({fn: 'getWidgetSettings'}, async (_widgetSettings) => {
            //         widgetSettings = _widgetSettings;
            //         if (widgetSettings.loggedIn) {
            //             chrome.runtime.sendMessage({fn: 'logout'});
            //         } else {
            //             chrome.runtime.sendMessage({fn: 'login'});
            //         }
            //     })
            // }
            // widgetElements['max']['btnSignup'].onclick = () => {
            //     chrome.runtime.sendMessage({fn: 'signup'});
            // }
            // widgetElements['max']['plusUpgrade'].onclick = () => {
            //     chrome.runtime.sendMessage({fn: 'upgrade'})
            // }
      widgetElements.min.centerAlertYes.onclick = () => {
        setReadSelectOption('selection-to-page-end');
        setReadToEndIcon('selection-to-page-end');
        readSelection('after-selection-to-page-end');
      };
      widgetElements.min.centerAlertNo.onclick = () => {
        setReadSelectOption('selection');
        setReadToEndIcon('selection');
      };
      widgetElements.max.centerAlertYes.onclick = () => {
        setReadSelectOption('selection-to-page-end');
        setReadToEndIcon('selection-to-page-end');
        readSelection('after-selection-to-page-end');
      };
      widgetElements.max.centerAlertNo.onclick = () => {
        setReadSelectOption('selection');
        setReadToEndIcon('selection');
      };
      widgetElements.min.centerAlertRemember.onclick = () => {
        setReadSelectOptRemember('min');
      };
      widgetElements.max.centerAlertRemember.onclick = () => {
        setReadSelectOptRemember('max');
      };
      generateDropdownItemsClickEvent(widgetElements.max.ccModeMenu, ccModeItemOnClick);
      generateDropdownItemsClickEvent(widgetElements.max.highlightModeMenu, highlightModeItemOnClick);
      generateDropdownItemsClickEvent(widgetElements.max.highlightColourMenu, highlightColourItemOnClick);
      generateMenuNavigationLinksClickEvent(widgetElements.max.menuNav, menuLinkOnClick);
      widgetElements.max.btnPreviewSpeed.onclick = () => {
        preview();
      };
      widgetElements.max.btnPreviewVoice.onclick = () => {
        preview();
      };
      widgetElements['max']['btnHotkeys'].onclick = () => {
          chrome.runtime.sendMessage({fn: 'editHotkeys'});
      }
      widgetElements.max.selectableCharLimit.onclick = (e) => {
        setCharLimit(e);
      };
      resolve();
    })
            .catch((err) => {
            });
  }
  function setCharLimit(e) {
    const selectedText = e.target.innerText;
    const charLimit = parseInt(selectedText.split(' ')[0], 10);
    widgetElements.max.selectedCharLimit.innerText = selectedText;
    setWidgetSetting('LimitedReadSelectionCharAmount', charLimit);
  }
  function readSelection(readSelectionOption) {
    chrome.runtime.sendMessage({ fn: 'readSelection', readSelectionOption });
    nrSelectionDetector.frame.style.display = 'none';
  }
  function rewind() {
    chrome.runtime.sendMessage({ fn: 'getWidgetSettings' }, async (_widgetSettings) => {
            // debounceRewind(_widgetSettings.returnNormalSkipTime, _widgetSettings.backwardStep);
      chrome.runtime.sendMessage({ fn: 'backward', number: _widgetSettings.backwardSkipNumber[_widgetSettings.backwardStep] });
    });
  }
  function forward() {
    chrome.runtime.sendMessage({ fn: 'getWidgetSettings' }, async (_widgetSettings) => {
            // debounceForward(_widgetSettings.returnNormalSkipTime, _widgetSettings.forwardStep);
      chrome.runtime.sendMessage({ fn: 'forward', number: _widgetSettings.forwardSkipNumber[_widgetSettings.forwardStep] });
    });
  }
  function debounceRewind(timeout, type) {
    if (rewindDecelerateTimer) {
      clearTimeout(rewindDecelerateTimer);
      if (type == 0) {
        setWidgetSetting('backwardStep', 1);
        rewind_1();
      }
    }
    rewindDecelerateTimer = setTimeout(setUIRewind_0, timeout);
  }
  function setUIRewind_0() {
    rewindDecelerateTimer = null;
    setWidgetSetting('backwardStep', 0);
    rewind_0();
  }
  function rewind_0() {
    if (widgetElements.min.btnBackward.classList.contains('btn-rewind2')) {
      widgetElements.min.btnBackward.classList.remove('btn-rewind2');
      widgetElements.max.btnBackward.classList.remove('btn-rewind2');
    }
    if (!widgetElements.min.btnBackward.classList.contains('btn-rewind')) {
      widgetElements.min.btnBackward.classList.add('btn-rewind');
      widgetElements.max.btnBackward.classList.add('btn-rewind');
    }
  }
  function rewind_1() {
    if (widgetElements.min.btnBackward.classList.contains('btn-rewind')) {
      widgetElements.min.btnBackward.classList.remove('btn-rewind');
      widgetElements.max.btnBackward.classList.remove('btn-rewind');
    }
    if (!widgetElements.min.btnBackward.classList.contains('btn-rewind2')) {
      widgetElements.min.btnBackward.classList.add('btn-rewind2');
      widgetElements.max.btnBackward.classList.add('btn-rewind2');
    }
  }
  function debounceForward(timeout, type) {
    if (forwardDecelerateTimer) {
      clearTimeout(forwardDecelerateTimer);
      if (type == 0) {
        setWidgetSetting('forwardStep', 1);
        forward_1();
      }
    }
    forwardDecelerateTimer = setTimeout(setUIForward_0, timeout);
  }
  function setUIForward_0() {
    forwardDecelerateTimer = null;
    setWidgetSetting('forwardStep', 0);
    forward_0();
  }
  function forward_0() {
    if (widgetElements.min.btnForward.classList.contains('btn-forward2')) {
      widgetElements.min.btnForward.classList.remove('btn-forward2');
      widgetElements.max.btnForward.classList.remove('btn-forward2');
    }
    if (!widgetElements.min.btnForward.classList.contains('btn-forward')) {
      widgetElements.min.btnForward.classList.add('btn-forward');
      widgetElements.max.btnForward.classList.add('btn-forward');
    }
  }
  function forward_1() {
    if (widgetElements.min.btnForward.classList.contains('btn-forward')) {
      widgetElements.min.btnForward.classList.remove('btn-forward');
      widgetElements.max.btnForward.classList.remove('btn-forward');
    }
    if (!widgetElements.min.btnForward.classList.contains('btn-forward2')) {
      widgetElements.min.btnForward.classList.add('btn-forward2');
      widgetElements.max.btnForward.classList.add('btn-forward2');
    }
  }
  function preview() {
    chrome.runtime.sendMessage({ fn: 'preview' });
  }
  function setReadSelectOption(value) {
    if (self.isRemember) {
      setWidgetSetting('readSelectionOption', value);
      setWidgetSetting('showReadSelectionToPageEndOption', false);
      setShowRSAlert(false);
    }
    dismissRSAlert();
  }
  function setReadSelectOptRemember(type) {
    if (widgetElements[type].centerAlertRemember.checked) {
      self.isRemember = true;
    } else {
      self.isRemember = false;
    }
  }
  function generateMenuNavigationLinksClickEvent(menuNav, onClickEvent) {
    const menuLinks = menuNav.querySelectorAll('a');
    for (let i = 0; i < menuLinks.length; i++) {
      menuLinks[i].onclick = onClickEvent;
    }
  }
  function generateDropdownItemsClickEvent(dropdownMenu, onClickEvent) {
    const dropdownItems = dropdownMenu.querySelectorAll('li');
    for (let i = 0; i < dropdownItems.length; i++) {
      dropdownItems[i].onclick = onClickEvent;
    }
  }
  function setUISelectedDropdownItem(dropdownItem) {
    const prevSelectedItem = dropdownItem.parentElement.querySelector('li.selected');
    const isSelected = dropdownItem.classList.contains('selected');
    if (!isSelected) {
      dropdownItem.classList.add('selected');
      if (prevSelectedItem != null) {
        prevSelectedItem.classList.remove('selected');
      }
    }
  }
  function updateUIDropdownCurrentHighlightColourIcon(iconElement, prefixClassName, value) {
    for (const _color in highlightColour) {
      iconElement.classList.remove(prefixClassName + _color);
    }
    iconElement.classList.add(prefixClassName + value);
  }
  function setUISelectedDropdownItemByValue(dropdownMenu, value) {
    const dropdownItems = dropdownMenu.querySelectorAll('li');
    for (let i = 0; i < dropdownItems.length; i++) {
      const optionValue = dropdownItems[i].getAttribute('value');
      if (optionValue == value) {
        setUISelectedDropdownItem(dropdownItems[i]);
        break;
      }
    }
  }
  function setUICCMode(mode) {
    curCCMode = mode;
    if (widgetElements.max.content) {
      widgetElements.max.content.classList.remove(ccMode['max-cc-full'].class);
      widgetElements.max.content.classList.remove(ccMode['max-cc-none'].class);
      if (curCCMode !== 'max-cc-compact') {
        widgetElements.max.content.classList.add(ccMode[curCCMode].class);
      }
    }
  }
  function highlightModeItemOnClick(e) {
    const mode = this.getAttribute('value');
    setWidgetSetting('beHighlighted', highlightMode[mode].value);
    updateUIDropdownCurrentText(widgetElements.max.curHighlightMode, chrome.i18n.getMessage(highlightMode[mode].keyMessage));
    setUISelectedDropdownItem(this);
  }
  function highlightColourItemOnClick(e) {
    const colour = this.getAttribute('value');
    setWidgetSetting('highlightColour', highlightColour[colour].value);
    updateUIDropdownCurrentText(widgetElements.max.curHighlightColour, chrome.i18n.getMessage(highlightColour[colour].keyMessage));
    updateUIDropdownCurrentHighlightColourIcon(widgetElements.max.curHighlightColourIcon, 'nr-ext-color-', highlightColour[colour].value);
    setUISelectedDropdownItem(this);
  }
  function ccModeItemOnClick(e) {
    const mode = this.getAttribute('value');
    setUICCMode(mode);
    setWidgetSetting('ccMode', ccMode[mode].value);
    updateUIDropdownCurrentText(widgetElements.max.curCCMode, chrome.i18n.getMessage(ccMode[mode].keyMessage));
    setUISelectedDropdownItem(this);
  }
  function menuLinkOnClick(e) {
    const hashval = this.getAttribute('href');
    const target = widgetElements.max.menuContainer.querySelector(hashval);
    let y = 0;
    if (target.offsetHeight + settingsCardMarginBottom < widgetElements.max.menuContainer.clientHeight / 2) {
      y = target.offsetTop - settingsCardMarginTop - (widgetElements.max.menuContainer.clientHeight / 2 - (target.offsetHeight + settingsCardMarginBottom));
    } else {
      y = target.offsetTop - settingsCardMarginTop;
    }
    widgetElements.max.menuContainer.scrollTo({
      top: y,
      behavior: 'smooth'
    });
    e.preventDefault();
  }
  function updateMenuNavLinkStyle() {
    if (widgetElements.max.menuContainer && widgetElements.max.menuNav) {
      const scrollContainer = widgetElements.max.menuContainer;
      const scrollPanels = widgetElements.max.menuContainer.children;
      const navLinks = widgetElements.max.menuNav.querySelectorAll('a');
      for (let i = 0; i < scrollPanels.length; i++) {
        if (scrollPanels[i].offsetTop - scrollContainer.scrollTop + settingsCardMarginTop < scrollContainer.clientHeight / 2 && scrollPanels[i].offsetTop + scrollPanels[i].offsetHeight + settingsCardMarginTop + settingsCardMarginBottom - scrollContainer.scrollTop > scrollContainer.clientHeight / 2) {
          navLinks[i].classList.add('active');
        } else {
          navLinks[i].classList.remove('active');
        }
      }
    }
  }
  function toggleMaxControl(target) {
    if (self.mode === 'min') {
      setMode('max');
    }
    if (widgetElements.max[target].classList.contains('show')) {
      if (curCCMode == 'max-cc-full') {
        configureWidgetFrame('max-cc-full');
      } else if (curCCMode == 'max-cc-compact') {
        if (mobileAndTabletcheck()) {
          configureWidgetFrame('max-cc-compact');
        } else {
          configureWidgetFrame('max');
        }
      } else {
        configureWidgetFrame('max');
      }
      widgetElements.max[target].classList.remove('show');
    } else {
      configureWidgetFrame('max-controls');
      widgetElements.max[target].classList.add('show');
      controls.filter((control) => control !== target).map((control) => {
        widgetElements.max[control].classList.remove('show');
      });
      updateMenuNavLinkStyle();
    }
  }
  function hideMaxControls() {
    controls.map((control) => {
      widgetElements.max[control].classList.remove('show');
    });
  }
  function setAutoScrollUI(isAutoScroll) {
    if (isAutoScroll) {
      widgetElements.max.btnRelocate.classList.remove('btn-location');
      widgetElements.max.btnRelocate.classList.add('btn-relocate');
      widgetElements.min.btnRelocate.classList.remove('btn-location');
      widgetElements.min.btnRelocate.classList.add('btn-relocate');
    } else {
      widgetElements.max.btnRelocate.classList.remove('btn-relocate');
      widgetElements.max.btnRelocate.classList.add('btn-location');
      widgetElements.min.btnRelocate.classList.remove('btn-relocate');
      widgetElements.min.btnRelocate.classList.add('btn-location');
    }
    widgetElements.max.autoTrackText.checked = isAutoScroll;
    const tooltipText = `${chrome.i18n.getMessage('Auto_scroll')} ${isAutoScroll ? 'OFF' : 'ON'}`;
    setTooltipText(widgetElements.max.btnRelocate, 'left', tooltipText);
    setTooltipText(widgetElements.min.btnRelocate, 'left', tooltipText);
  }
  function setLocateToggle(_autoScroll) {
    isAutoScroll = _autoScroll;
    setAutoScrollUI(isAutoScroll);
    chrome.runtime.sendMessage({ fn: 'relocate' });
    setWidgetSetting('isAutoScroll', isAutoScroll);
  }
  function setDyslexiaToggle(isDyslexic) {
    widgetElements.max.dyslexia.checked = isDyslexic;
    setWidgetSetting('isDyslexic', isDyslexic);
    setDyslexicFont(isDyslexic);
  }
  function setDyslexicFont(isDyslexic) {
    if (isDyslexic) {
      widgetElements.max.ccText.classList.add('dyslexicfonts');
    } else {
      widgetElements.max.ccText.classList.remove('dyslexicfonts');
    }
  }
  function setMode(mode, checkMenu = true) {
    return new Promise((resolve) => {
      self.mode = mode;
      if (self.mode == 'min') {
        configureWidgetFrame(mode);
      } else {
        configureWidgetFrame(curCCMode);
      }
      setReaderUI();
      if (checkMenu && mode.includes('max')) {
        if (widgetElements.max.menu.classList.contains('show')) {
          configureWidgetFrame('max-controls');
        }
      } else {
        hideMaxControls();
      }
      widgetElements[self.mode.includes('min') ? 'max' : 'min'].container.style.display = 'none';
      widgetElements[self.mode.includes('min') ? 'min' : 'max'].container.style.display = 'block';
      setWidgetSetting('mode', mode);
      resolve();
    })
            .catch((err) => {
            });
  }
  function setReaderUI() {
    if (self.readerState === 'reading') {
      setUIOnPlay();
    } else if (self.readerState === 'pause') {
      setUIOnPause();
    } else {
      setUIOnLoading();
    }
  }
  function setUIOnLoading() {
    const _mode = self.mode.includes('min') ? 'min' : 'max';
    if (widgetElements[_mode].animationRead) {
      if (widgetElements[_mode].animationRead.classList.contains('playing')) {
        widgetElements[_mode].animationRead.classList.remove('playing');
      }
      widgetElements[_mode].animationRead.classList.add('waiting');
    } else {
      widgetElements[_mode].btnRead.classList.add('spin');
    }
    if (widgetElements[_mode].btnPreviewVoice) {
      widgetElements[_mode].btnPreviewVoice.style.display = 'none';
    }
    if (widgetElements[_mode].btnPreviewSpeed) {
      widgetElements[_mode].btnPreviewSpeed.style.display = 'none';
    }
  }
  function setUIOnPlay() {
    const _mode = self.mode.includes('min') ? 'min' : 'max';
    if (widgetElements[_mode].iconBtnRead) {
      widgetElements[_mode].iconBtnRead.classList.replace('mdi-play-circle-filled', 'mdi-pause-circle-filled');
    } else {
      widgetElements[_mode].btnRead.classList.remove('btn-play');
      widgetElements[_mode].btnRead.classList.add('btn-pause');
    }
    if (widgetElements[_mode].animationRead) {
      if (widgetElements[_mode].animationRead.classList.contains('waiting')) {
        widgetElements[_mode].animationRead.classList.remove('waiting');
      }
      if (widgetElements[_mode].animationRead.classList.contains('mdi-pause-circle-filled')) {
        widgetElements[_mode].animationRead.classList.add('playing');
      }
    }
    if (widgetElements[_mode].btnForward) {
      if (_mode === 'max') {
        widgetElements[_mode].btnForward.style.visibility = 'visible';
      } else {
        widgetElements[_mode].btnForward.style.display = 'inline-block';
      }
    }
    if (widgetElements[_mode].btnBackward) {
      if (_mode === 'max') {
        widgetElements[_mode].btnBackward.style.visibility = 'visible';
      } else {
        widgetElements[_mode].btnBackward.style.display = 'inline-block';
      }
    }
    if (widgetElements[_mode].btnRelocate) {
      if (_mode === 'max') {
        widgetElements[_mode].btnRelocate.style.visibility = 'visible';
      } else {
        widgetElements[_mode].btnRelocate.style.display = 'inline-block';
      }
    }
    if (widgetElements[_mode].btnAdd) {
      widgetElements[_mode].btnAdd.style.display = 'none';
    }
    if (_mode == 'min' && widgetElements[_mode].btnSettings) {
      widgetElements[_mode].btnSettings.style.display = 'none';
    }
    if (widgetElements[_mode].btnRead && widgetElements[_mode].btnRead.classList.contains('spin')) {
      widgetElements[_mode].btnRead.classList.remove('spin');
    }
    if (widgetElements[_mode].btnPreviewVoice) {
      widgetElements[_mode].btnPreviewVoice.style.display = 'none';
    }
    if (widgetElements[_mode].btnPreviewSpeed) {
      widgetElements[_mode].btnPreviewSpeed.style.display = 'none';
    }
    if (widgetElements.min.btnStop) {
      widgetElements.min.btnStop.style.display = 'none';
    }
    if (widgetElements.max.btnStop) {
      widgetElements.max.btnStop.style.visibility = 'hidden';
    }
    widgetElements.min.progressCircle.style.display = 'block';
    widgetElements.min.progress.style.display = 'block';
    self.readerState = 'reading';
  }
  function setUIOnPause() {
    const _mode = self.mode.includes('min') ? 'min' : 'max';
    if (widgetElements[_mode].iconBtnRead) {
      widgetElements[_mode].iconBtnRead.classList.replace('mdi-pause-circle-filled', 'mdi-play-circle-filled');
    } else {
      widgetElements[_mode].btnRead.classList.remove('btn-pause');
      widgetElements[_mode].btnRead.classList.add('btn-play');
    }
    if (widgetElements[_mode].animationRead) {
      widgetElements[_mode].animationRead.classList.remove('playing');
      if (widgetElements[_mode].animationRead.classList.contains('waiting')) {
        widgetElements[_mode].animationRead.classList.remove('waiting');
      }
    }
    if (widgetElements[_mode].btnForward) {
      if (_mode === 'max') {
        widgetElements[_mode].btnForward.style.visibility = 'hidden';
      } else {
        widgetElements[_mode].btnForward.style.display = 'none';
      }
    }
    if (widgetElements[_mode].btnBackward) {
      if (_mode === 'max') {
        widgetElements[_mode].btnBackward.style.visibility = 'hidden';
      } else {
        widgetElements[_mode].btnBackward.style.display = 'none';
      }
    }
    if (widgetElements[_mode].btnRelocate) {
      if (_mode === 'max') {
        widgetElements[_mode].btnRelocate.style.visibility = 'hidden';
      } else {
        widgetElements[_mode].btnRelocate.style.display = 'none';
      }
    }
    if (widgetElements[_mode].btnAdd) {
      widgetElements[_mode].btnAdd.style.display = 'inline-block';
    }
    if (_mode == 'min' && widgetElements[_mode].btnSettings) {
      widgetElements[_mode].btnSettings.style.display = 'inline-block';
    }
    if (widgetElements[_mode].btnRead.classList.contains('spin')) {
      widgetElements[_mode].btnRead.classList.remove('spin');
    }
    if (widgetElements[_mode].btnPreviewVoice) {
      widgetElements[_mode].btnPreviewVoice.style.display = 'block';
    }
    if (widgetElements[_mode].btnPreviewSpeed) {
      widgetElements[_mode].btnPreviewSpeed.style.display = 'block';
    }
    self.readerState = 'pause';
  }
  function injectWidget(request, sender, sendResponse) {
    if (!self.isInjectingWidget && !self.hasWidget) {
      self.isInjectingWidget = true;
      chrome.runtime.sendMessage({ fn: 'setIcon', state: 'loading' });
      setWidgetSetting('mode', 'min');
      if (!self.loadingTimer) {
        self.loadingTimer = setTimeout(() => {
          clearTimeout(self.loadingTimer);
          chrome.runtime.sendMessage({ fn: 'setIcon' });
        }, 10000);
      }
      const iframe = document.createElement('iframe');
      self.frame = iframe;
      self.frame.id = 'nr-ext-widget';
      self.frame.style.background = 'none';
      self.frame.style.backgroundColor = 'transparent';
      configureWidgetFrame('min');
      self.frame.style.overflow = 'hidden';
      self.frame.style.position = 'fixed';
      self.frame.style.display = 'none';
      self.frame.style.zIndex = '9000000000000000000';
      self.frame.style.borderStyle = 'none';
      self.frame.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.26)';
      document.body.appendChild(iframe);
      fetch(chrome.runtime.getURL('injected/nr-ext-widget/nr-ext-widget.html'))
                .then((response) => response.text())
                .then((widget) => {
                  try {
                    self.frame.onload = async (event) => {
                      await frameContentOnLoad();
                      sendResponse(true);
                    };
                    self.frame.contentDocument.write(widget);
                    self.widgetDocument = self.frame.contentDocument;
                    self.frame.contentDocument.close();
                  } catch (err) {
                    self.frame.contentDocument.close();
                  }
                }).catch(err => {
                });
    }
  }
  async function frameContentOnLoad() {
    const css = [
      'assetsReader/bootstrap-material-design-icons/css/material-icons.css',
      'assetsReader/css/material-dashboard.css',
      'assetsReader/css/ion.rangeSlider.css',
      'injected/nr-ext-widget/nr-ext-widget.css'
    ];
    const js = [
      'assetsReader/js/core/jquery.min.js',
      'assetsReader/js/core/popper.min.js',
      'assetsReader/js/core/bootstrap-material-design.min.js',
      'assetsReader/js/plugins/bootstrap-selectpicker.js',
      'assetsReader/js/plugins/nouislider.min.js',
      'assetsReader/js/plugins/ion.rangeSlider.min.js'
    ];
    await loadResource('css', 'https://fonts.googleapis.com/css?family=Material+Icons');
    await loadResource(null, 'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css');
    await loadResource(null, chrome.runtime.getURL('assetsReader/bootstrap-material-design-icons/css/material-icons.css'));
    await loadResource(null, chrome.runtime.getURL('assetsReader/css/material-dashboard.css'));
    await loadResource(null, chrome.runtime.getURL('assetsReader/css/ion.rangeSlider.css'));
    await loadResource(null, chrome.runtime.getURL('injected/nr-ext-widget/nr-ext-widget.css'));
    await loadResource(null, chrome.runtime.getURL('assetsReader/js/core/jquery.min.js'));
    await loadResource(null, chrome.runtime.getURL('assetsReader/js/core/popper.min.js'));
    await loadResource(null, chrome.runtime.getURL('assetsReader/js/core/bootstrap-material-design.min.js'));
    await loadResource(null, chrome.runtime.getURL('assetsReader/js/plugins/bootstrap-selectpicker.js'));
    await loadResource(null, chrome.runtime.getURL('assetsReader/js/plugins/nouislider.min.js'));
    await loadResource(null, chrome.runtime.getURL('assetsReader/js/plugins/ion.rangeSlider.min.js'));
    await loadResource(null, chrome.runtime.getURL('injected/nr-ext-widget/range-slider-init.js'));
    await init();
    self.frame.style.display = 'block';
    self.hasWidget = true;
        // chrome.runtime.sendMessage({fn: 'setIcon'});
    clearTimeout(self.loadingTimer);
    self.isInjectingWidget = false;
  }
  function toggleWidget(request, sender, sendResponse) {
    try {
      if ((request && request.toShow) || self.frame.style.display === 'none') {
        self.frame.style.display = 'block';
        setWidgetSetting('isVisible', true);
      } else {
        self.frame.style.display = 'none';
        setWidgetSetting('isVisible', false);
      }
    } catch (err) {

    }
  }
  function configureWidgetFrame(mode) {
    self.frame.style.removeProperty('left');
    self.frame.style.removeProperty('right');
    self.frame.style.removeProperty('top');
    self.frame.style.removeProperty('bottom');
    for (const property in frameStyles[mode]) {
      self.frame.style[property] = frameStyles[mode][property];
      // self.frame.style.setProperty(property, frameStyles[mode][property], "important");
      // self.frame.style.setProperty("min-width", "137px", "important");
      // self.frame.style.setProperty("max-width", "137px", "important");
      // self.frame.style.setProperty("height", "355px", "important");
      // self.frame.style.set
    }
  }
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.fn in nrExtWidget) {
      nrExtWidget[request.fn](request, sender, sendResponse);
      if (nrExtWidget.isAsyncFunction(request.fn)) {
        return true;
      }
    } else if (request.message === 'injectWidget') {
      injectWidget(request, sender, sendResponse);
      return true;
    } else if (request.message === 'readerOnPlay') {
      setReadSliderValue(request.index);
      setUIOnPlay();
    } else if (request.message === 'readerOnLoading') {
      setUIOnLoading();
    } else if (request.message === 'readerOnPause') {
      setUIOnPause();
    } else if (request.message === 'readerOnStop') {
      setReadSliderMax([])
                .then(() => {
                  setReadSliderValue(0);
                  resetReadProgress();
                  widgetElements.min.progressCircle.style.display = 'none';
                  widgetElements.min.progress.style.display = 'none';
                  $(widgetElements.max.ccText).empty();
                });
      setUIOnPause();
      widgetElements.min.btnStop.style.display = 'none';
            // widgetElements['max']['btnStop'].style.display = 'none';
      widgetElements.max.btnStop.style.visibility = 'hidden';
      self.widgetDocument.getElementById('nr-ext-bar-header-text').style.display = 'none';
    } else if (request.message === 'textsToReadOnChange') {
      setReadSliderMax(request.texts);
    } else if (request.message === 'tabOnActivated') {
      setWidgetUI(request);
    } else if (request.fn === 'setLoggedInUI' || request.fn === 'setLoggedOutUI') {
        chrome.runtime.sendMessage({ fn: 'getWidgetSettings' }, async (_widgetSettings) => {
            widgetSettings = _widgetSettings;
            if (widgetSettings && widgetSettings.userInfo) { setUserUI(widgetSettings.userInfo, widgetSettings.loggedIn); }
          });
      } else if (request.message === 'readSelectionOnEnd') {
        } else if (request.message === 'toggleShowReadIcon') {
          setReadIcon(request.value);
        } else if (request.message === 'highlightColourOnChange') {
        } else if (request.message === 'beHighlightedOnChange') {
        } else if (request.message === 'ccModeOnChange') {
        }
  });
  function setLoggedInUI() {
    const loginLogoutBtn = self.widgetDocument.getElementById('btnLoginLogout');
    const signupBtn = self.widgetDocument.getElementById('btnSignup');
    loginLogoutBtn.innerText = self.btnLogoutText;
    signupBtn.style.visibility = 'hidden';
  }
  function setUserInfoUI(userInfo) {
    const userEmail = self.widgetDocument.getElementById('userEmail');
    const userLicType = self.widgetDocument.getElementById('userLicType');
    if (!userInfo) {
      userEmail.innerText = '';
      userLicType.innerText = self.freeUserText;
    }
    if (userInfo.email && userInfo.email != self.defaultEmail) {
      userEmail.innerText = userInfo.email;
    } else {
      userEmail.innerText = '';
    }
    let userLicNum = 0;
    if (userInfo.licNum) {
      userLicNum = userInfo.licNum;
    } else if (userInfo.license) {
      userLicNum = userInfo.license;
      if (userLicNum === '0') {
        userLicNum = 0;
      } else if (userLicNum === '12') {
        userLicNum = 12;
      } else if (userLicNum === '32') {
        userLicNum = 32;
      } else if (userLicNum === '13') {
        userLicNum = 13;
      }
    }
    const pwLicNum = userInfo.pwLicNum;
    resetUserPlans();
    if (userLicNum == 12) {
      userLicType.innerText = self.premUserText;
      setUserPlans('prem-user', ['prem-plus-upgrade']);
    } else if (userLicNum == 13) {
      userLicType.innerText = self.plusUserText;
      setUserPlans('plus-user');
    } else if (userLicNum == 32 && pwLicNum == 0) {
      userLicType.innerText = self.eduPremUserText;
      setUserPlans('prem-user', ['free-plus-upgrade']);
    } else if (userLicNum == 32) {
      userLicType.innerText = self.eduPremUserText;
      setUserPlans('prem-user', ['prem-plus-upgrade']);
    } else {
      userLicType.innerText = self.freeUserText;
      setUserPlans('free-user', ['prem-upgrade', 'free-plus-upgrade']);
    }
  }
  function setLoggedOutUI() {
    const loginLogoutBtn = self.widgetDocument.getElementById('btnLoginLogout');
    const signupBtn = self.widgetDocument.getElementById('btnSignup');
    loginLogoutBtn.innerText = self.btnLoginText;
    signupBtn.innerText = self.btnSignupText;
    signupBtn.style.visibility = 'visible';
    resetUserPlans();
  }
  function resetUserPlans() {
    const planIds = ['free-user', 'prem-user', 'prem-upgrade', 'plus-user', 'free-plus-upgrade', 'prem-plus-upgrade'];
    for (i in planIds) {
      const planElm = self.widgetDocument.getElementById(planIds[i]);
      planElm.style.display = 'none';
    }
  }
  function setUserPlans(user, upgrade) {
    const userElm = self.widgetDocument.getElementById(user);
    userElm.style.display = 'block';
    if (upgrade) {
      for (i in upgrade) {
        const upgradeElm = self.widgetDocument.getElementById(upgrade[i]);
        upgradeElm.style.display = 'block';
      }
    }
  }
  function setUserUI(userInfo, loggedIn) {
    if (loggedIn) {
      setLoggedInUI();
      setUserInfoUI(userInfo);
    } else {
      setLoggedOutUI();
      setUserInfoUI(userInfo);
    }
  }
  function isAsyncFunction(fnName) {
    return self.asyncFunctions.includes(fnName);
  }
  function getHasTextProcessor(request, sender, sendResponse) {
    try {
      if (nrTextProcessor === undefined) {
        sendResponse(false);
      } else {
        sendResponse(true);
      }
      return true;
    } catch (err) {
      sendResponse(false);
      return true;
    }
  }
  function getHasWidget(request, sender, sendResponse) {
    sendResponse(self.hasWidget);
  }
  function voicesOnLoad(request, sender, sendResponse) {
    if (!self.isVoicesInit) {
      setUIVoiceLists();
    }
  }
  function setSpeedSliderValue(value, shouldSetWidgetSetting = true) {
    widgetElements.max.speedValue.value = value;
    const ev = new Event('change');
    widgetElements.max.speedValue.dispatchEvent(ev);
    if (shouldSetWidgetSetting) {
      setWidgetSetting('speed', value);
    }
  }
  function setReadSliderValue(senIndex = 0, pageIndex = null, percentage = null, lastModified = null, tag = 'nr-ext-widget') {
    let _readValue;
    if (!widgetElements.max.readValue.value) {
      _readValue = {
        sentenceIndex: 0,
        pageIndex: -1,
        percentage: 0,
        lastModified: 'sentence',
        tag
      };
    } else {
      _readValue = JSON.parse(widgetElements.max.readValue.value);
      _readValue.tag = tag;
    }
    if (getTypeOfProgressMode(readOption) === 'page') {
      if (doc.getPageIndex() === -1) {
        _readValue.pageIndex = doc.getPages().length - 1;
      } else {
        _readValue.pageIndex = doc.getPageIndex();
      }
    }
    if (pageIndex != null) {
      _readValue.pageIndex = pageIndex;
    }
    _readValue.sentenceIndex = senIndex;
    if (percentage != null) {
      _readValue.percentage = percentage;
    }
    if (lastModified != null) {
      _readValue.lastModified = lastModified;
    }
    widgetElements.max.readValue.value = JSON.stringify(_readValue);
    const event = new Event('change');
    widgetElements.max.readValue.dispatchEvent(event);
  }
  function getReadProgressIndexBySlider() {
    const _readValue = JSON.parse(widgetElements.max.readValue.value);
    if (getTypeOfProgressMode(readOption) === 'page') {
      return parseInt(_readValue.pageIndex);
    }
    return parseInt(_readValue.sentenceIndex);
  }
  function setReadSliderMax(texts) {
    return new Promise((resolve) => {
      const _maxValue = {
        readOption: 'all',
        texts,
        pageCount: -1
      };
      if (texts.length > 0) {
        chrome.runtime.sendMessage({ fn: 'getReadOption' }, (_readOption) => {
          _maxValue.readOption = _readOption;
          readOption = _readOption;
          if (getTypeOfProgressMode(readOption) === 'page') {
            _maxValue.pageCount = doc.getPages().length;
          }

          if (widgetElements.max.readMaxValue.value !== JSON.stringify(_maxValue)) {
            widgetElements.max.readMaxValue.value = JSON.stringify(_maxValue);
            const ev = new Event('change');
            widgetElements.max.readMaxValue.dispatchEvent(ev);
          }
          resolve();
        });
      } else {
        if (widgetElements.max.readMaxValue.value !== JSON.stringify(_maxValue)) {
          widgetElements.max.readMaxValue.value = JSON.stringify(_maxValue);
          const ev = new Event('change');
          widgetElements.max.readMaxValue.dispatchEvent(ev);
        }
        resolve();
      }
    });
  }
  function getTypeOfProgressMode(_readOption) {
    let _mode = 'sentence';
    if (typeof doc !== 'undefined' && (doc.type === 'googleDoc' || doc.type === 'googleDrivePreview')) {
      if (doc.getPages().length > 1 && _readOption !== 'selection') {
        _mode = 'page';
      }
    }
    return _mode;
  }
  function getReadSliderMax() {
    const _value = JSON.parse(widgetElements.max.readMaxValue.value);
    _maxValue = _value.texts.length;
    if (getTypeOfProgressMode(readOption) === 'page') {
      _maxValue = _value.pageCount;
    }
    return _maxValue;
  }
  function setTriggerCircleReadProgress(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickPercent = calculateProgressByPosition(x, y, rect);
    updateProgress(clickPercent);
  }
  function calculateProgressByPosition(x, y, rect) {
    let percent = 0;
    if (x > rect.width / 2) {
      percent = y * 50 / rect.height;
    } else {
      percent = (rect.height - y) * 50 / rect.height + 50;
    }
    return percent;
  }
  function updateProgress(value) {
    initProgress(value);
  }
  function setUICurrBeingRead(readProgress) {
    if (readProgress < curCircleProgress || readProgress == 0) {
      resetReadProgress();
    }
    setCircleProgress(parseInt(curCircleProgress), parseInt(readProgress));
  }
  function setCircleProgress(start, end) {
    let prevProgress = start;
    if (isNaN(prevProgress)) {
      prevProgress = -1;
    }
    window.requestAnimationFrame(render);
    curCircleProgress = end;
    function render() {
      prevProgress += 1;
      if (prevProgress >= 50 && !over) {
        over = true;
        widgetElements.min.progress.classList.add('over50');
      }
      const nrdeg = `${3.6 * prevProgress}deg`;
      self.widgetDocument.documentElement.style.setProperty('--nrdeg', nrdeg);
      if (prevProgress < end) {
        window.requestAnimationFrame(render);
      }
    }
  }
  function resetReadProgress() {
    over = false;
    widgetElements.min.progress.classList.remove('over50');
    setCircleProgress(-1, 0);
  }
  function initProgress(value) {
    const _readValue = JSON.parse(widgetElements.max.readValue.value);
    const _maxValue = JSON.parse(widgetElements.max.readMaxValue.value);
    if (getTypeOfProgressMode(readOption) === 'page') {
      const rate = _maxValue.pageCount * value / 100;
      const pageIndex = Math.floor(rate);
      const _decimal = rate - pageIndex;
      if (pageIndex == _readValue.pageIndex) {
        const _index = Math.floor(_maxValue.texts.length * _decimal);
        setReadSliderValue(_index, undefined, undefined, 'sentence', 'circle-progress');
      } else {
        setReadSliderValue(0, pageIndex, _decimal, 'page', 'circle-progress');
      }
    } else {
      const senIndex = Math.floor(_maxValue.texts.length * value / 100);
      setReadSliderValue(senIndex, undefined, undefined, 'sentence', 'circle-progress');
    }
  }
  function initTooltip(elem, direction, text) {
    const tooltip = setTooltip(elem, direction, text);
    elem.onmouseenter = function () {
      tooltip.style.display = 'block';
      tooltip.style.visibility = 'visible';
    };
    elem.onmouseleave = function () {
      tooltip.style.display = 'none';
    };
    tooltip.onmouseenter = function () {
      tooltip.style.display = 'none';
    };
  }
  function setTooltip(elem, direction, text) {
    list = elem.getElementsByClassName(`${direction}Tooltip`);
    for (let i = 0; i < list.length; i++) {
      elem.removeChild(list[i]);
    }
    const tooltip = document.createElement('span');
    tooltip.classList.add(`${direction}Tooltip`);
    tooltip.style.display = 'none';
    tooltip.innerHTML = text;
    elem.appendChild(tooltip);
    return tooltip;
  }
  function setTooltipText(elem, direction, text) {
    const tooltips = elem.getElementsByClassName(`${direction}Tooltip`);
    for (let i = 0; i < tooltips.length; i++) {
      tooltips[i].innerHTML = text;
    }
  }
  function debounce(func, wait = 500, immediate = true) {
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) { func.apply(context, args); }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function getTextNodes(node) {
    let textNodes = [];
    if (node && node instanceof Node) {
        let walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        let n = null;
        while (n = walk.nextNode()) {
            textNodes.push(n);
        }
    }
    return textNodes;
}

  function clickWordCC(e){

    chrome.runtime.sendMessage({ fn: 'pause' });
    const words = self.widgetDocument.getElementsByTagName("ejoy-word")

    const sentenceDom = e.target.parentElement;
    const indexSentence = sentenceDom.className.replace('nr-cc-s', '')
    for (let i = 0; i < words.length; i++) {
      words[i].style.backgroundColor = "transparent";
    }
    const selectSentences = $('.nr-s' + indexSentence);
    let number = $(e.target).attr("data-index");
    let chunkIndex = $(e.target).attr("chunk-index");
    const word =  e.target.innerText;
    if(selectSentences.length){
      console.log('clickWordCC', selectSentences)

      for (let i = 0; i < selectSentences.length; i++) {
        const sentence = selectSentences[i];
        let text = sentence.innerText;
  
        if(text.includes(word)){
               
                const textNodes = getTextNodes(sentence)
                if(textNodes.length){
                  for (let j = 0; j < textNodes.length; j++) {
                    const textNode = textNodes[j];
                    const textNodeData = textNode.data;
                    if(textNodeData.includes(word)){
                      let index = textNodeData.indexOf(word)
                      console.log(index, textNodeData)
                      const range = new Range();
                      range.setStart(textNode, index)
                      range.setEnd(textNode, index + word.length)
                      // range.selectNode(textNode)
                      window.getSelection().removeAllRanges();
                      window.getSelection().addRange(range)
                    }
                  }
                }
                break;
        }
      }
    }
    // chrome.runtime.sendMessage( { type: 'show_inject_pop', event:{
    //   editable: false,
    //   // frameId: 0
    //   // menuItemId: "popupEjoy"
    //   // pageUrl: "https://en.wikipedia.org/wiki/Number"
    //   // parentMenuItemId: "ejoy_context_menu"
    //   selectionText: e.target.innerText
    // } })
    console.log(window.getSelection().rangeCount, 'selection')
    if(window.getSelection().rangeCount){
          chrome.runtime.sendMessage( { fn: 'showInjectPop', event:{
        editable: false,
        // frameId: 0
        // menuItemId: "popupEjoy"
        pageUrl: window.location.href,
        // parentMenuItemId: "ejoy_context_menu"
        selectionText: e.target.innerText
      } })
    e.target.style.backgroundColor = 'red'
  }
  }
  function setCCText(request, sender, sendResponse) {
    $(widgetElements.max.ccText).empty();
    const text = request.text;
    const index = request.sentenceIndex;
    const chunkIndex = request.textChunkIndex
    const nrSentence = document.createElement('nr-sentence');
    $(nrSentence).addClass(`nr-cc-s${index}`);
    const textNode = document.createTextNode(text);
    const wordArr = getNlpSentences(text);
    wordArr.map((word, index) => {
      const nrWord = document.createElement('ejoy-word');
      const textWordNode = document.createTextNode(word);
      nrWord.appendChild(textWordNode)
      nrWord.setAttribute('data-index',index)
      nrWord.setAttribute('chunk-index',chunkIndex)
      nrSentence.appendChild(nrWord);
      nrWord.style.cursor = "pointer";
      nrWord.onclick= clickWordCC;
      const space = document.createTextNode(' ');
      nrSentence.appendChild(space);
    })
    // nrSentence.appendChild(textNode);
    widgetElements.max.ccText.appendChild(nrSentence);
    sendResponse();
  }
  function getWidgetElements() {
    return widgetElements;
  }
  function getNlpSentences(text) {
    let sentences = nlp(text).terms().data()
    return sentences.map(x => x.text.trim());
}
}
var nrExtWidget = nrExtWidget || new NRExtWidget();

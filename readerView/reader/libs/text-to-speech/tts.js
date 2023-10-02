/* global tokenizer */
'use strict';

{
  class Emitter {
    constructor() {
      this.events = {};
    }
    on(name, callback) {
      this.events[name] = this.events[name] || [];
      this.events[name].push(callback);
    }
    emit(name, ...data) {
      (this.events[name] || []).forEach(c => {
        c(...data);
      });
    }
  }

  window.addEventListener('unload', () => speechSynthesis.cancel());

  const LAZY = Symbol();
  const CALC = Symbol();
  const TEXT = Symbol();
  const SRC = Symbol();
  const CACHE = Math.random().toString(36).substring(7);

  class SimpleTTS extends Emitter {
    constructor(doc = document, options = {
      separator: '\n!\n',
      delay: 300,
      maxlength: 160,
      minlength: 60,
      scroll: 'center'
    }) {
      super();
      this.doc = doc;

      this.SEPARATOR = options.separator; // this is used to combine multiple sections on local voice case
      this.DELAY = options.delay; // delay between sections
      this.MAXLENGTH = options.maxlength; // max possible length for each section
      this.MINLENGTH = options.minlength; // min possible length for each section

      this.postponed = []; // functions that need to be called when voices are ready
      this.sections = [];
      this.local = true;
      this.dead = false;
      this.offset = 0;
      this.state = 'stop';

      // for local voices, use separator to detect when a new section is played
      this.on('instance-boundary', e => {
        if (e.charIndex && e.target.text.substr(e.charIndex - 1, 3) === this.SEPARATOR) {
          const passed = e.target.text.substr(0, e.charIndex - 1);
          if (passed.endsWith(this.sections[this.offset].textContent)) {
            this.offset += 1;
            this.emit('section', this.offset);
          }
        }
      });
      // delete the audio element when idle is emitted
      this.on('idle', () => delete this.audio);
      // for remote voices use end event to detect when a new section is played
      this.on('instance-end', () => {
        if (this.local === false) {
          if (this.sections.length > this.offset + 1 && this.dead === false) {
            this.offset += 1;
            this.emit('section', this.offset);
            this.instance.text = this[TEXT]();
            // delay only if there is a section
            const timeout = this.sections[this.offset].target === this.sections[this.offset - 1].target ?
              0 : this.DELAY;
            this[LAZY](() => this.speak(), timeout);
          }
          else {
            if (this.sections.length === this.offset + 1) {
              this.emit('idle');
            }
            this.emit('end');
          }
        }
        else {
          this.emit('idle');
          this.emit('end');
        }
      });
      this.on('instance-start', () => this.emit('section', this.offset));

      this.voices = speechSynthesis.getVoices();
      if (this.voices.length === 0) {
        Promise.race([
          new Promise(resolve => speechSynthesis.addEventListener('voiceschanged', resolve)),
          new Promise(resolve => window.setTimeout(resolve, 1000))
        ]).then(() => {
          this.voices = speechSynthesis.getVoices(true);
          this.postponed.forEach(c => c());
        });
      }
    }
    [LAZY](callback, timeout = this.DELAY) {
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(callback, timeout);
    }
    ready() {
      return this.voices.length ? Promise.resolve() : new Promise(resolve => this.postponed.push(resolve));
    }
    create() {
      const instance = new SpeechSynthesisUtterance();
      instance.onstart = () => this.emit('instance-start');
      instance.onresume = () => this.emit('instance-resume');
      instance.onpause = () => this.emit('instance-pause');
      instance.onboundary = e => this.emit('instance-boundary', e);
      instance.onend = () => this.emit('instance-end');
      this.instance = instance;

      if (this.audio) {
        this.audio.pause();
      }
      this.audio = new Audio();
      let s = false;
      this.audio.addEventListener('pause', () => {
        if (this.audio) {
          instance.onpause();
        }
        else {
          instance.onend();
        }
      });
      this.audio.addEventListener('ended', () => {
        instance.onend();
      });
      this.audio.addEventListener('canplay', () => {
        if (s === false) {
          instance.onstart();
          s = true;
        }
      });
      this.audio.addEventListener('playing', () => {
        if (s === true) {
          instance.onresume();
          s = true;
        }
      });
      this.audio.addEventListener('error', e => {
        console.warn('TTS Error', e);
        this.emit('error', e.message || 'tts.js: Cannot decode this audio');
        this.emit('status', 'error');
      });
    }
    voice(voice) {
      this.local = voice.localService;
      delete this._voice;
      if (speechSynthesis.speaking && voice.voiceURI === 'custom') {
        speechSynthesis.cancel();
      }
      if (voice.voiceURI === 'custom') {
        this._voice = voice;
      }
      else {
        this.instance.voice = voice;
      }
    }
    stop() {
      this.state = 'stop';
      window.clearTimeout(this.timer);
      // already playing
      const speaking = speechSynthesis.speaking || (this.audio ? !this.audio.paused : false);
      if (speaking) {
        this.dead = true;
        speechSynthesis.cancel();
        if (/Firefox/.test(navigator.userAgent)) {
          speechSynthesis.pause();
          speechSynthesis.resume();
        }
      }
      if (this.audio) {
        this.audio.pause();
      }
    }
    record() {

    }
    [TEXT](offset = this.offset) {
      if (this.local) {
        return this.sections.slice(offset).map(e => e.textContent).join(this.SEPARATOR);
      }
      else {
        const section = this.sections[offset];
        return section ? section.textContent : '';
      }
    }
    start(offset = 0) {
      this.state = 'play';
      this.offset = offset;
      if (speechSynthesis.speaking) {
        this.stop();
      }
      // initiate
      this.instance.text = this[TEXT]();
      this.dead = false;
      this.speak();
    }
    async [SRC](text) {
      const r = new RegExp(this.SEPARATOR.replace(/\//g, '//'), 'g');
      return this._voice.build(text.replace(r, `<break strength="strong"/>`));
    }
    async speak() {
      this.state = 'play';
      if (this._voice) {
        const src = await this[SRC](this.instance.text);
        this.emit('status', 'buffering');
        this.audio.src = src;
        this.audio.play();
      }
      else {
        speechSynthesis.speak(this.instance);
      }
    }
    resume() {
      this.state = 'play';
      if (this._voice) {
        this.audio.play();
      }
      else {
        speechSynthesis.resume();
      }
      // bug; remote voice does not trigger resume event
      if (this.local === false) {
        this.emit('instance-resume');
      }
    }
    pause() {
      this.state = 'pause';
      // bug; remote voice does not trigger pause event
      if (this.local === false) {
        this.emit('instance-pause');
      }

      if (this._voice) {
        this.audio.pause();
      }
      else {
        speechSynthesis.pause();
      }
    }
  }
  class PreLoadTTS extends SimpleTTS {
    constructor(...args) {
      super(...args);
      this.CACHE = CACHE;
    }
    create() {
      super.create();
      this.audio.addEventListener('canplaythrough', async () => {
        const next = this[TEXT](this.offset + 1);
        if (next && typeof caches !== 'undefined') {
          const src = await super[SRC](next);
          const c = await caches.open(CACHE);
          // only add src if it is not available
          (await c.match(src)) || c.add(src);
        }
      });
    }
    async [SRC](text) {
      const src = await super[SRC](text);
      try {
        const c = await caches.open(CACHE);
        const r = await c.match(src);
        if (r) {
          const b = await r.blob();
          return URL.createObjectURL(b);
        }
      }
      catch (e) { }
      return src;
    }
  }
  class Parser extends PreLoadTTS {
    feed(...parents) {
      let nodes = [];
      const texts = node => {
        if (node.nodeType === Node.TEXT_NODE) {
          nodes.unshift(node);
        }
        else {
          const iterator = document.createNodeIterator(node, NodeFilter.SHOW_TEXT);
          let c;
          while (c = iterator.nextNode()) {
            nodes.unshift(c);
          }
        }
      };
      parents.forEach(page => texts(page));
      const sections = [];
      while (nodes.length) {
        const node = nodes.shift();
        if (node.nodeValue) {
          const e = node.parentElement;
          if (e.offsetParent !== null) { // is element hidden
            sections.unshift(e);
          }
          nodes = nodes.filter(n => e.contains(n) === false);
        }
      }
      // if a section is already included, remove it;
      const toBeRemoved = [];
      sections.forEach((e, i) => {
        for (const section of sections.slice(Math.max(0, i - 10), i)) {
          if (section.contains(e)) {
            toBeRemoved.push(e);
          }
        }
      });
      for (const e of toBeRemoved) {
        const index = sections.indexOf(e);
        sections.splice(index, 1);
      }
      // marge small sections
      for (let i = 0; i < sections.length; i += 1) {
        const a = sections[i];
        const b = sections[i + 1];
        if (
          a.textContent.length < this.MINLENGTH && b &&
          a.textContent.length + b.textContent.length < this.MAXLENGTH
        ) {
          const o = {
            textContent: a.textContent + this.SEPARATOR + b.textContent,
            targets: [a.targets ? a.targets : (a.target || a), b.targets ? b.targets : (b.target || b)].flat()
          };
          o.target = o.targets[0];
          sections.splice(i, 2, o);
          i -= 1;
        }
      }
      // split by [.,]
      for (const section of sections) {
        if (section.textContent.length < this.MAXLENGTH || section.targets) {
          this.sections.push(section);
        }
        else {
          const parts = [];
          if (typeof tokenizer === 'object') {
            parts.push(...tokenizer.sentences(section.textContent, {}));
          }
          else {
            let offset = 0;
            for (const i of [...section.textContent.matchAll(/[.,]\s/g), {
              index: section.textContent.length
            }].map(m => m.index)) {
              const p = section.textContent.substring(offset, i + 1).replace(/\u00A0/g, ' ');
              parts.push(p);
              offset = i + 2;
            }
          }
          const combined = [];
          let length = 0;
          let cache = [];
          for (const part of parts) {
            if (length > this.MAXLENGTH) {
              combined.push(cache.join(' '));
              cache = [part];
              length = part.length;
            }
            else {
              cache.push(part);
              length += part.length;
            }
          }
          if (cache.length !== 0) {
            combined.push(cache.join(' '));
          }
          let offset = 0;
          const textContent = section.textContent.replace(/\u00A0/g, ' ');
          for (const content of combined) {
            let pos = textContent.indexOf(content, offset);
            if (pos === -1) {
              pos = textContent.indexOf(content.split(/[,.]\s/)[0], offset);
            }
            if (pos === -1) {
              pos = textContent.indexOf(content.split('\n')[0].trim(), offset);
            }
            if (pos === -1) {
              offset = 0;
              console.warn('cannot detect part', content, section);
            }
            else {
              offset = pos;
            }
            const s = {
              target: section,
              textContent: content,
              offset
            };
            this.sections.push(s);
          }
        }
      }
    }
  }
  class Styling extends Parser {
    constructor(doc, options) {
      super(doc, options);

      const box = document.createElement('div');
      box.classList.add('tts-box', 'hidden');
      doc.body.appendChild(box);

      const range = new Range();
      const word = document.createElement('div');
      word.classList.add('tts-word', 'hidden');
      doc.body.appendChild(word);

      const extract = es => {
        let n;
        const a = [];
        for (const e of es) {
          const walk = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, null, false);
          while (n = walk.nextNode()) {
            a.push(n);
          }
        }
        return a;
      };
      {
        let offset = 0;
        let padding = 0;
        this.on('instance-boundary', e => {
          if (e.name === 'word') {
            const search = e.target.text.substr(e.charIndex, e.charLength);
            if (search.length < 2) { // to prevent SEPARATOR search
              return;
            }
            const section = this.sections[this.offset];
            const target = section.target || section;
            const targets = section.targets || [target];
            const nodes = extract(targets);
            const r = new Range();
            r.setStart(nodes[0], 0);
            for (let index = offset; index < nodes.length; index += 1) {
              const node = nodes[index];
              r.setEnd(node, node.nodeValue.length);
              if (section.offset && section.offset > r.toString().length) {
                continue;
              }
              let p = 0;
              if (index === offset && padding === 0 && section.offset) {
                p = section.offset;
              }
              else if (index === offset) {
                p = padding;
              }
              const start = node.nodeValue.indexOf(search, p);
              if (start !== -1) {
                padding = start + search.length;
                offset = index;
                range.setStart(node, start);
                range.setEnd(node, start + e.charLength);
                const rect = [...range.getClientRects()].pop();
                word.style.left = rect.x + 'px';
                word.style.top = (doc.documentElement.scrollTop + rect.y + rect.height) + 'px';
                word.style.width = rect.width + 'px';
                break;
              }
            }
          }
        });
        this.on('section', () => {
          offset = 0;
          padding = 0;
        });
        this.on('instance-start', () => {
          offset = 0;
          padding = 0;
        });
        this.on('instance-resume', () => {
          offset = 0;
          padding = 0;
        });
      }

      const visible = e => {
        const rect = e.getBoundingClientRect();
        return rect.top >= 0 &&
          rect.bottom <= (this.doc.defaultView.innerHeight || this.doc.documentElement.clientHeight);
      };
      this.on('section', n => {
        const section = this.sections[n];

        const es = section.targets ? section.targets : [section.target || section];
        const boxes = es.map(e => e.getBoundingClientRect());
        const top = Math.min(...boxes.map(r => r.top)) - 5;
        box.style.top = (doc.documentElement.scrollTop + top) + 'px';
        box.style.height = (Math.max(...boxes.map(r => r.bottom)) - top + 5) + 'px';
        box.classList.remove('hidden');
        word.classList.remove('hidden');
        if (visible(es[0]) === false) {
          es[0].scrollIntoView({
            block: options.scroll,
            inline: 'nearest'
          });
        }
      });
      this.on('instance-start', () => this.emit('status', 'play'));
      this.on('instance-resume', () => this.emit('status', 'play'));
      this.on('instance-pause', () => this.emit('status', 'pause'));
      this.on('end', () => this.emit('status', 'stop'));
      this.on('end', () => {
        box.classList.add('hidden');
        word.classList.add('hidden');
      });
      this.on('instance-start', () => {
        word.classList[this.local ? 'remove' : 'add']('hidden');
      });
      this.on('instance-resume', () => {
        word.classList[this.local ? 'remove' : 'add']('hidden');
      });
    }
  }
  class Navigate extends Styling {
    [CALC](direction = 'forward') {
      const offset = this.offset;
      let jump = 1;
      if (direction === 'forward' && this.sections[offset].target) {
        const { target } = this.sections[offset];
        for (const section of this.sections.slice(offset + 1)) {
          if (section.target !== target) {
            break;
          }
          else {
            jump += 1;
          }
        }
      }
      if (direction === 'backward' && this.sections[offset].target) {
        const target = this.sections[offset].target;
        for (const section of this.sections.slice(0, offset).reverse()) {
          if (section.target !== target) {
            break;
          }
          else {
            jump += 1;
          }
        }
      }
      if (direction === 'backward' && offset - jump > 0 && this.sections[offset - jump].target) {
        const target = this.sections[offset - jump].target;
        for (const section of this.sections.slice(0, offset - jump).reverse()) {
          if (section.target !== target) {
            break;
          }
          else {
            jump += 1;
          }
        }
      }
      return jump;
    }
    validate(direction = 'forward') {
      const offset = this.offset;
      const jump = this[CALC](direction);
      if (
        (direction === 'forward' && offset + jump < this.sections.length) ||
        (direction === 'backward' && offset - jump >= 0)
      ) {
        return offset + (direction === 'forward' ? jump : -1 * jump);
      }
      throw Error('out of range');
    }
    navigate(direction = 'forward', offset) {
      try {
        offset = typeof offset === 'undefined' ? this.validate(direction) : offset;
        this.stop();
        this.create();
        this.offset = offset;
        this[LAZY](() => this.start(this.offset));
      }
      catch (e) {
        console.warn('navigate request ignored');
      }
    }
  }
  class Options extends Navigate {
    constructor(doc, options) {
      super(doc, options);
      this.options = {
        get pitch() {
          return Number(localStorage.getItem('tts-pitch') || '1');
        },
        set pitch(val) {
          localStorage.setItem('tts-pitch', val);
        },
        get volume() {
          return Number(localStorage.getItem('tts-volume') || '1');
        },
        set volume(val) {
          localStorage.setItem('tts-volume', val);
        },
        get rate() {
          return Number(localStorage.getItem('tts-rate') || '1');
        },
        set rate(val) {
          localStorage.setItem('tts-rate', val);
        }
      };
    }
    create() {
      super.create();
      this.instance.pitch = this.options.pitch;
      this.instance.rate = this.options.rate;
      this.instance.lang = this.options.lang;
      this.instance.volume = this.options.volume;
      if (this.audio) {
        this.audio.addEventListener('playing', () => {
          this.audio.volume = this.options.volume;
          console.log('this.options.rate', this.options.rate);
          this.audio.playbackRate = this.options.rate;
        });
      }
    }
  }
  class Intractive extends Options {
    async attach(parent) {
      const iframe = document.createElement('iframe');
      iframe.style = `
        border: none;
        width: 300px;
        height: 100px;
        opacity: 0;
      `;
      iframe.srcdoc = `<html>
      <head>
        <style>
          body {
            display: flex;
            flex-direction: column;
            margin: 0;
            padding: 20px 0 20px 20px;
          }
          body,
          table {
            font-size: 13px;
            font-family: Arial,"Helvetica Neue",Helvetica,sans-serif;
          }
          [data-id=controls] {
            display: flex;
            align-items: center;
            filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3));
            height: 56px;
            background: #FFFFFF;
            border-radius: 28px 0 0 28px;
            padding-left: 18px;
          }
          button {
            width: 36px;
            height: 32px;
            outline: none;
            border: none;
            cursor: pointer;
            background-size: 24px;
            background-position: center center;
            background-repeat: no-repeat;
            background-color: transparent;
            opacity: 0.7;
          }
          button:hover,
          input[type=button]:hover {
            opacity: 1;
          }
          button:active,
          input[type=button]:active {
            opacity: 0.3;
          }
          button:disabled,
          input[type=button]:disabled {
            opacity: 0.3;
            cursor: default;
          }
          select {
            -webkit-appearance: none;
            -moz-appearance: none;
            width: 100%;
            opacity: 0;
            background-size: 35px;
            text-indent: 100px;
            border: none;
            outline: none;
            cursor: pointer;
            background-color: transparent;
            height: 24px;
          }
          label {
            position: relative;
            flex: 1;
          }

          label .flat-img{
            width: 33px;
            height: 24px;
            background: url(chrome-extension://${chrome.runtime.id}/assetsReader/img/flags.svg) no-repeat top left;
            background-position: -258px 0; 
          }

          label > span{
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }

          label[data-full=da-DK] .flat-img{
            background-position: 0 0;
          }
          label[data-full=de-DE] .flat-img{
            background-position: -43px 0;
          }
          label[data-full=en-AU] .flat-img{
            background-position: -86px 0;
          }
          label[data-full=en-GB-WLS] .flat-img{
            background-position: -129px 0;
          }
          label[data-full=en-GB] .flat-img{
            background-position: -172px 0;
          }
          label[data-full=en-IN] .flat-img{
            background-position: -215px 0;
          }
          label[data-full=en-US] .flat-img{
            background-position: -258px 0;
          }
          label[data-full=es-ES] .flat-img{
            background-position: -301px 0;
          }
          label[data-full=fr-CA] .flat-img{
            background-position: -344px 0;
          }
          label[data-full=fr-FR] .flat-img{
            background-position: -387px 0;
          }
          label[data-full=is-IS] .flat-img{
            background-position: -430px 0;
          }
          label[data-full=it-IT] .flat-img{
            background-position: -473px 0;
          }
          label[data-full=ja-JP] .flat-img{
            background-position: -516px 0;
          }
          label[data-full=ko-KR] .flat-img{
            background-position: -559px 0;
          }
          label[data-full=no-NO] .flat-img{
            background-position: -602px 0;
          }
          label[data-full=nl-NL] .flat-img{
            background-position: -645px 0;
          }
          label[data-full=pl-PL] .flat-img{
            background-position: -688px 0;
          }
          label[data-full=pt-BR] .flat-img{
            background-position: -731px 0;
          }
          label[data-full=pt-PT] .flat-img{
            background-position: -774px 0;
          }
          label[data-full=ro-RO] .flat-img{
            background-position: -817px 0;
          }
          label[data-full=ru-RU] .flat-img{
            background-position: -860px 0;
          }
          label[data-full=sv-SE] .flat-img{
            background-position: -903px 0;
          }
          label[data-full=tr-TR] .flat-img{
            background-position: -946px 0;
          }

          label svg{
            width: 20px;
            height: 20px;
            margin-left: 10px;
          }

          table div {
            display: flex;
            align-items: center;
          }
          table input {
            flex: 1;
            margin-right: 5px;
          }
          input[type="range"] + span {
            background-color: rgba(0, 0, 0, 0.1);
            min-width: 20px;
            text-align: center;
            padding: 0 5px;
          }
          .play svg:last-child {
            display: none;
          }
          .pause svg:first-child {
            display: none;
          }
          .record {
            display: none;
          }
          .record[data-active=true] {
            fill: red;
          }
  
  
          .controls-view{
            filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3));
            /* width: 288px; */
            height: 56px;
            display: flex;
            /* justify-content: center; */
            align-items: center;
            background: #FFFFFF;
            border-radius: 28px 0 0 28px;
          }
          [data-id=controls] button{
            padding: 0 8px;
            cursor: pointer;
          }
          .volume-tr{
            display: none;
          }


          .ejoy-change-text-speech-popup{
            background: #FFFFFF;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            position: fixed;
            display: flex;
            padding: 16px;
            top: 70px;
            display: none;
          }
          
          .ejoy-slider-container{
            background: #F0F0F0;
            border-radius: 100px;
            width: 16px;
            height: 296px;
            flex-direction: column;
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: relative;
            overflow: hidden;
          }
          
          .ejoy-mile-stone-speed-container{
            height: 296px;
            flex-direction: column;
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: relative;
            overflow: hidden;
            margin-right: 8px;
            padding-left: 2px;
            padding-right: 2px;
          }
          
          .ejoy-slider-mile-stone{
            color:#B3B3B3;
            font-weight: 600;
            font-size: 12px;
            line-height: 16px;
            left:0;
          }
          
          #ejoy-mile-stone-indicator{
            color: #1DA1F2;
            position: absolute;
          }
          
          .ejoy-speed-slider{
              -webkit-appearance: none;
              -webkit-transform: rotate(270deg);
              transform: rotate(270deg);
              position: absolute;
              -webkit-transform-origin: 0 0;
              transform-origin: 0 0;
              padding: 0;
              margin: 0;
              left: 0;
              top: 0;
              height: 16px;
              width: 296px;
              top:296px;
              background-color: transparent;
              outline-offset: 0;
          }
          
          .ejoy-speed-slider:hover {
            opacity: 1; /* Fully shown on mouse-over */
          }
          
          /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
          .ejoy-speed-slider::-webkit-slider-thumb {
            -webkit-appearance: none; /* Override default look */
            appearance: none;
            width: 16px; /* Set a specific slider handle width */
            height: 16px; /* Slider handle height */
            background: #1DA1F2; /* Green background */
            cursor: pointer; /* Cursor on hover */
          }
          
          .ejoy-speed-slider::-moz-range-thumb {
            width: 16px; /* Set a specific slider handle width */
            height: 16px; /* Slider handle height */
            background: #1DA1F2; /* Green background */
            cursor: pointer; /* Cursor on hover */
          }
          
          
          .ejoy-slider-container .ejoy-slider-ball{
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background: #C4C4C4;
            z-index: 2;
            pointer-events: none;
            line-height: 16px;
          }
          
          .ejoy-ball-container{
            width: 16px;
            height: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          #fill-slider-ejoy{
            background: #1DA1F2;
            position: absolute;
            bottom:0;
            left:0;
            right:0;
          }
          
          .ejoy-slider-container .ejoy-slider-ball.ejoy-active{
            background: #FFFFFF;
          }
          .help-icon{
            position: absolute;
            bottom: 0;
            right: 0;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div data-id="controls">
          <button class="rateView">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="16" viewBox="0 0 23 16" fill="none">
              <path d="M6.54406 5.5167C6.5488 5.44331 6.52415 5.37096 6.4756 5.31572L4.27787 2.81541C4.22931 2.76016 4.16077 2.72647 4.0873 2.72173C4.01353 2.71702 3.94156 2.74164 3.88632 2.79019C2.87646 3.67788 2.03823 4.72475 1.39478 5.90172C1.35953 5.96629 1.35127 6.04223 1.37196 6.11279C1.39266 6.18338 1.44054 6.24288 1.50512 6.27814L4.42615 7.87482C4.46839 7.89794 4.514 7.90888 4.55901 7.90888C4.65713 7.90888 4.75226 7.85666 4.80265 7.76448C5.22793 6.98654 5.78232 6.29439 6.45035 5.70719C6.5057 5.65871 6.53939 5.59017 6.54406 5.5167Z" fill="#1DA1F2"/>
              <path d="M7.52479 4.59072C7.57462 4.68466 7.67072 4.73818 7.77011 4.73818C7.81396 4.73818 7.85845 4.72776 7.89983 4.7058C8.68278 4.29057 9.52504 4.01963 10.4033 3.90048C10.5551 3.8799 10.6615 3.74013 10.6409 3.5883L10.1935 0.289611C10.1729 0.137817 10.0327 0.0315534 9.8813 0.0519843C8.54757 0.232875 7.26864 0.644258 6.08002 1.2747C5.9447 1.34649 5.89319 1.51435 5.9649 1.64975L7.52479 4.59072Z" fill="#1DA1F2"/>
              <path d="M3.95117 9.05472L0.738353 8.18302C0.667349 8.16382 0.591602 8.17349 0.527769 8.2101C0.463936 8.2467 0.417285 8.30713 0.397974 8.37814C0.13394 9.35165 0 10.3607 0 11.3771C0 11.5511 0.00414595 11.7256 0.012774 11.9106C0.0196839 12.0593 0.142307 12.1752 0.289694 12.1752C0.294027 12.1752 0.298434 12.1751 0.302767 12.1749L3.62816 12.0213C3.70163 12.0179 3.77084 11.9854 3.82033 11.9311C3.86989 11.8767 3.89585 11.8048 3.89242 11.7314C3.88663 11.6066 3.88383 11.4907 3.88383 11.3771C3.88383 10.7041 3.97216 10.0372 4.14637 9.39506C4.18637 9.24722 4.099 9.09487 3.95117 9.05472Z" fill="#1DA1F2"/>
              <path d="M16.3873 1.07656C15.1767 0.492953 13.8833 0.131284 12.543 0.00137726C12.4693 -0.00601823 12.3966 0.0166163 12.3398 0.0633423C12.283 0.110106 12.2472 0.177487 12.2401 0.25077L11.9191 3.56425C11.9043 3.71671 12.016 3.85233 12.1685 3.86709C13.0519 3.95266 13.9039 4.19088 14.7009 4.57504C14.7388 4.59334 14.78 4.6026 14.8214 4.6026C14.8522 4.6026 14.8831 4.59741 14.9129 4.58706C14.9823 4.56282 15.0393 4.51191 15.0712 4.44565L16.5167 1.44686C16.5833 1.30888 16.5254 1.14305 16.3873 1.07656Z" fill="#1DA1F2"/>
              <path d="M21.2769 5.73017C21.2948 5.6588 21.2837 5.58331 21.2459 5.52011C20.5575 4.3684 19.6797 3.3544 18.637 2.50642C18.5799 2.46003 18.5071 2.43829 18.4336 2.44565C18.3604 2.45323 18.2932 2.4895 18.2468 2.54657L16.1463 5.12916C16.0999 5.18627 16.0781 5.25944 16.0856 5.33261C16.0931 5.40578 16.1295 5.47298 16.1866 5.51944C16.8764 6.08041 17.4571 6.75108 17.9124 7.51282C17.9644 7.5997 18.0564 7.64795 18.1508 7.64795C18.1992 7.64795 18.2483 7.63525 18.2928 7.60859L21.1502 5.9006C21.2133 5.86284 21.2589 5.80155 21.2769 5.73017Z" fill="#1DA1F2"/>
              <path d="M22.3375 7.95637C22.2916 7.81014 22.1359 7.72868 21.9898 7.77458L18.8132 8.76991C18.667 8.8157 18.5856 8.97134 18.6314 9.1175C18.8594 9.84531 18.975 10.6055 18.975 11.377C18.975 11.4906 18.9722 11.6065 18.9664 11.7312C18.963 11.8047 18.9889 11.8766 19.0385 11.931C19.0881 11.9853 19.1572 12.0178 19.2307 12.0212L22.556 12.1748C22.5604 12.175 22.5648 12.1751 22.5691 12.1751C22.7164 12.1751 22.8391 12.0592 22.846 11.9105C22.8546 11.7254 22.8588 11.5509 22.8588 11.377C22.8587 10.2111 22.6834 9.06027 22.3375 7.95637Z" fill="#1DA1F2"/>
              <path d="M11.4196 10.7882C11.3718 10.7882 11.3242 10.7898 11.2768 10.7923L6.77038 8.13348C6.66009 8.0683 6.52006 8.08463 6.42765 8.17326C6.33517 8.26182 6.31298 8.40106 6.37327 8.51394L8.83152 13.1214C8.82248 13.2101 8.81766 13.2997 8.81766 13.3901C8.81766 14.0851 9.08831 14.7385 9.57974 15.2299C10.0712 15.7214 10.7246 15.992 11.4196 15.992C12.1147 15.992 12.7681 15.7213 13.2595 15.2299C13.7509 14.7385 14.0215 14.0851 14.0215 13.3901C14.0215 12.6951 13.7509 12.0417 13.2595 11.5503C12.7681 11.0588 12.1146 10.7882 11.4196 10.7882Z" fill="#1DA1F2"/>
            </svg>
          </button>
          <button disabled="true" class="previous">
            <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.879066 12.6105C1.2572 12.6105 1.58131 12.9002 1.61078 13.2784C1.94963 17.3593 5.38229 20.5415 9.55649 20.5415C13.9517 20.5415 17.5317 16.986 17.5317 12.6154C17.5317 8.31354 14.0646 4.79739 9.76274 4.68935C9.64979 4.68444 9.5614 4.77284 9.5614 4.88578V7.35593C9.5614 7.97469 8.8788 8.34791 8.35334 8.01889L3.62913 4.71391C3.13804 4.40452 3.13804 3.69245 3.62913 3.38307L8.34843 0.122286C8.87389 -0.206739 9.55649 0.166484 9.55649 0.785248V3.02949C9.55649 3.13753 9.63997 3.22593 9.74801 3.22593C14.8749 3.32905 19 7.49343 19 12.6154C19 17.8012 14.7718 22 9.55649 22C4.60638 22 0.550041 18.2334 0.147354 13.4011C0.108067 12.9739 0.451824 12.6105 0.879066 12.6105Z" fill="#8C8C8C"/>
            </svg>
          </button>
          <button disabled="true" class="play">
            <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0.517676V19.4796C0 19.8796 0.408418 20.1296 0.735152 19.9296L15.8466 10.4486C16.1671 10.2486 16.1671 9.75491 15.8466 9.55491L0.735152 0.0739384C0.408418 -0.132306 0 0.117687 0 0.517676Z" fill="#1DA1F2"/>
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.8895 22H4.902C4.62075 22 4.39575 21.775 4.39575 21.5V2.5C4.39575 2.225 4.62075 2 4.902 2H8.8895C9.17075 2 9.39575 2.225 9.39575 2.5V21.5C9.39575 21.775 9.17075 22 8.8895 22ZM19.8895 22H15.902C15.6208 22 15.3958 21.775 15.3958 21.5V2.5C15.3958 2.225 15.6208 2 15.902 2H19.8895C20.1708 2 20.3958 2.225 20.3958 2.5V21.5C20.3958 21.775 20.1708 22 19.8895 22Z" fill="#1DA1F2"/>
            </svg>
          </button>
          <button disabled="true" class="next">
            <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.1209 12.6105C17.7428 12.6105 17.4187 12.9002 17.3892 13.2784C17.0504 17.3593 13.6177 20.5415 9.44351 20.5415C5.04832 20.5415 1.46834 16.986 1.46834 12.6154C1.46834 8.31354 4.93538 4.79739 9.23726 4.68935C9.35021 4.68444 9.4386 4.77284 9.4386 4.88578V7.35593C9.4386 7.97469 10.1212 8.34791 10.6467 8.01889L15.3709 4.71391C15.862 4.40452 15.862 3.69245 15.3709 3.38307L10.6516 0.122286C10.1261 -0.206739 9.44351 0.166484 9.44351 0.785248V3.02949C9.44351 3.13753 9.36003 3.22593 9.25199 3.22593C4.12509 3.32905 0 7.49343 0 12.6154C0 17.8012 4.22822 22 9.44351 22C14.3936 22 18.45 18.2334 18.8526 13.4011C18.8919 12.9739 18.5482 12.6105 18.1209 12.6105Z" fill="#8C8C8C"/>
            </svg>
          </button>
          <button disabled="true" class="record">
            <svg viewBox="0 0 512 512">
                <circle cx="256" cy="256" r="220"/>
            </svg>
          </button>
          <button disabled="true" class="stop">
            <svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="12" height="12" fill="#1DA1F2"/>
            </svg>
          </button>
          <label data-id="lang">
            <span>
              <span class="flat-img"></span>
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M0.333344 2.33334L4.00001 6.00001L7.66668 2.33334H0.333344Z" fill="#333333"/>
              </svg>
            </span>
            <select></select>
          </label>
          <span class="help-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99999 1.16669C3.77763 1.16669 1.16666 3.77766 1.16666 7.00002C1.16666 10.2224 3.77763 12.8334 6.99999 12.8334C10.2223 12.8334 12.8333 10.2224 12.8333 7.00002C12.8333 3.77766 10.2223 1.16669 6.99999 1.16669ZM6.87939 9.69233C6.54846 9.69233 6.27923 9.43993 6.27923 9.11461C6.27923 8.79209 6.54846 8.53688 6.87939 8.53688C7.21313 8.53688 7.48236 8.78929 7.48236 9.11461C7.48236 9.43993 7.21593 9.69233 6.87939 9.69233ZM7.35335 7.82454C7.35335 7.46556 7.51881 7.25803 8.00679 6.97478C8.52562 6.66909 8.79485 6.28487 8.79485 5.72678C8.79485 4.88824 8.0713 4.30491 7.01961 4.30491C5.89221 4.30491 5.22474 4.94433 5.20511 5.84737H6.2007C6.22314 5.43231 6.52883 5.15747 6.95231 5.15747C7.37017 5.15747 7.70671 5.41268 7.70671 5.76044C7.70671 6.10819 7.50759 6.28768 7.03364 6.57093C6.52602 6.86821 6.3241 7.22718 6.37178 7.80491L6.38019 8.04609H7.35335V7.82454Z" fill="#8C8C8C"/>
            </svg>
          </span>
        </div>

        <div class="ejoy-change-text-speech-popup">
          <div class="ejoy-mile-stone-speed-container">
            <div class="ejoy-slider-mile-stone" style="position: absolute; bottom: 80%">800 WPM</div>
            <div class="ejoy-slider-mile-stone" style="position: absolute; bottom: 60%">600 WPM</div>
            <div class="ejoy-slider-mile-stone" style="position: absolute; bottom: 40%">400 WPM</div>
            <div class="ejoy-slider-mile-stone" style="position: absolute; bottom: 20%">200 WPM</div>
            <div class="ejoy-slider-mile-stone" style="opacity: 0;">800 WPM</div>
            <div class="ejoy-slider-mile-stone"style="opacity: 0;">600 WPM</div>
            <div class="ejoy-slider-mile-stone"style="opacity: 0;">400 WPM</div>
            <div class="ejoy-slider-mile-stone"style="opacity: 0;">200 WPM</div>
            <div id="ejoy-mile-stone-indicator" class="ejoy-slider-mile-stone"></div>
          </div>
          <div class="ejoy-slider-container">
            <div id="fill-slider-ejoy"></div>
            <input min="0.1" max="3" step="0.1" type="range" class="ejoy-speed-slider" id="rate">
            <div class="ejoy-ball-container" style="position: absolute; bottom: 80%">
              <div class="ejoy-slider-ball" style="position: absolute; bottom: 80%"></div>
            </div>
            <div class="ejoy-ball-container" style="position: absolute; bottom: 60%">
              <div class="ejoy-slider-ball" style="position: absolute; bottom: 60%"></div>
            </div>
            <div class="ejoy-ball-container" style="position: absolute; bottom: 40%">
              <div class="ejoy-slider-ball" style="position: absolute; bottom: 40%"></div>
            </div>
            <div class="ejoy-ball-container" style="position: absolute; bottom: 20%">
              <div class="ejoy-slider-ball" style="position: absolute; bottom: 20%"></div>
              </div>
          </div>
        </div>
       
        <table width="100%">
          <colgroup>
            <col width=60px>
            <col>
          </colgroup>
          <tbody>
            <tr class="volume-tr" title="Represents the volume value, between 0 (lowest) and 1 (highest).">
              <td>Volume</td>
              <td>
                <div>
                  <input min="0.1" max="1" step="0.1" type="range" id="volume"><span>1</span>
                </div>
              </td>
            </tr>
            <tr class="volume-tr" title="Represents the pitch value. It can range between 0 (lowest) and 2 (highest), with 1 being the default pitch for the current platform or voice.">
              <td>Pitch</td>
              <td>
                <div>
                  <input min="0.1" max="2" step="0.1" type="range" id="pitch"><span>1</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`;
      parent.appendChild(iframe);
      await new Promise(resolve => iframe.onload = resolve);
      // iframe.removeAttribute('srcdoc');

      const divHelpIcon = iframe.contentDocument.querySelector('.help-icon');
      divHelpIcon.onclick = function () {
        ((chrome.i18n.getUILanguage ? chrome.i18n.getUILanguage().substring(0, 2) : 'en') === 'vi') ? window.open('https://ejo.bz/how-to-use-reader-view-vi') : window.open('https://ejo.bz/how-to-use-reader-view')
      }

      Object.assign(iframe.style, {
        opacity: 1,
        width: iframe.contentDocument.body.clientWidth + 'px',
        height: iframe.contentDocument.body.clientHeight + 'px'
      });
      const div = iframe.contentDocument.querySelector('div');
      // voice
      const select = div.querySelector('select');
      const label = div.querySelector('label');
      select.addEventListener('change', () => {
        const parts = select.value.split('/');
        [label.dataset.value, label.title] = parts;

        let langFull = select.options[select.selectedIndex].innerText;
        langFull = langFull.match(/\[(.*)\]/)[1]
        console.log('langFull', langFull);
        label.dataset.full = langFull;

        localStorage.setItem('tts-selected', select.value);
        if (this.instance) {
          this.voice(select.selectedOptions[0].voice);
          if ((speechSynthesis.speaking && speechSynthesis.paused === false) || this.audio) {
            this.navigate(undefined, this.offset);
          }
        }
      });
      // controls
      const previous = div.querySelector('.previous');
      previous.addEventListener('click', () => this.navigate('backward'));
      const play = div.querySelector('.play');
      console.log('play', play)
      play.addEventListener('click', () => {
        console.log('click')
        if (speechSynthesis.speaking === false && !this.audio) {
          this.create();
          this.start();
          console.log('start')
        }
        else if (this.state === 'pause') {
          this.resume();
        }
        else {
          this.pause();
        }
      });
      const next = div.querySelector('.next');
      next.addEventListener('click', () => this.navigate('forward'));
      const stop = div.querySelector('.stop');
      stop.addEventListener('click', () => {
        this.stop();
        this.emit('idle');
      });
      const record = div.querySelector('.record');
      record.addEventListener('click', () => {
      
      });

      const docIframe = iframe.contentDocument;
      const rateView = div.querySelector('.rateView');
      rateView.addEventListener('click', () => {
        if (docIframe.querySelector('.ejoy-change-text-speech-popup').style.display !== 'flex') {
          Object.assign(docIframe.querySelector('.ejoy-change-text-speech-popup').style, {
            display: 'flex'
          });
          Object.assign(iframe.style, {
            height: '416px'
          });
          Object.assign(parent.style, {
            height: '416px'
          });
        } else {
          Object.assign(docIframe.querySelector('.ejoy-change-text-speech-popup').style, {
            display: 'none'
          });
          Object.assign(iframe.style, {
            height: '150px'
          });
          Object.assign(parent.style, {
            height: 'auto'
          });
        }
      });

      this.ready().then(() => {
        play.disabled = false;

        let value;
        const langs = {};
        for (const o of this.voices) {
          const lang = o.lang.split('-')[0];
          langs[lang] = langs[lang] || [];
          langs[lang].push(o);
        }
        for (const [lang, os] of Object.entries(langs).sort()) {
          const optgroup = document.createElement('optgroup');
          optgroup.label = lang;
          os.forEach(o => {
            const option = document.createElement('option');
            option.textContent = `[${ o.lang }] ` + o.name;
            option.value = lang + '/' + o.name;
            option.voice = o;
            if (o.default) {
              value = option.value;
            }
            optgroup.appendChild(option);
          });
          select.appendChild(optgroup);
        }

        if (select.options.length) {
          select.value = localStorage.getItem('tts-selected') || value || select.options[0].value;
          if (!select.value) {
            select.value = value || select.options[0].value;
          }
          select.dispatchEvent(new Event('change'));
        }
        else {
          console.warn('there is no TTS voice available');
        }
      });

      const calc = () => {
        try {
          this.validate('forward');
          next.disabled = false;
        }
        catch (e) {
          next.disabled = true;
        }
        try {
          this.validate('backward');
          previous.disabled = false;
        }
        catch (e) {
          previous.disabled = true;
        }
      };
      this.on('end', () => {
        record.disabled = stop.disabled = true;
        next.disabled = true;
        previous.disabled = true;
      });
      this.on('status', s => {
        if (s === 'stop' || s === 'pause') {
          play.classList.remove('pause');
          play.classList.add('play');
          record.disabled = stop.disabled = s === 'stop' ? true : false;
          next.disabled = true;
          previous.disabled = true;
        }
        else if (s === 'buffering') {
          play.disabled = true;
          next.disabled = true;
          previous.disabled = true;
          record.disabled = stop.disabled = false;
        }
        else if (s === 'error') {
          play.disabled = false;
          next.disabled = true;
          previous.disabled = true;
          record.disabled = stop.disabled = true;
        }
        else { // play
          play.classList.add('pause');
          play.classList.remove('play');
          record.disabled = stop.disabled = false;
          play.disabled = false;
          calc();
        }
      });
      this.on('section', calc);
      this.controls = {};

      const doc = iframe.contentDocument;
      // volume
      {
        const input = doc.getElementById('volume');
        const span = input.nextElementSibling;
        span.textContent = input.value = this.options.volume;
        input.addEventListener('input', () => {
          this.options.volume = input.value;
          span.textContent = input.value;
          if (this.instance) {
            this.instance.volume = input.value;
            if (this.audio) {
              this.audio.volume = input.value;
            }
          }
        });
        this.controls.volume = input;
      }
      // pitch
      {
        const input = doc.getElementById('pitch');
        const span = input.nextElementSibling;
        span.textContent = input.value = this.options.pitch;
        input.addEventListener('input', () => {
          this.options.pitch = input.value;
          span.textContent = input.value;
          if (this.instance) {
            this.instance.pitch = input.value;
          }
        });
        this.controls.pitch = input;
      }
      // rate
      {
        const input = doc.getElementById('rate');
        // const span = input.nextElementSibling;
        // span.textContent = input.value = this.options.rate;
        const fillBar = doc.getElementById('fill-slider-ejoy');
        const max = input.max;
        const mileStoneIndicator = doc.getElementById('ejoy-mile-stone-indicator');
        input.value = this.options.rate;
        fillBar.style.height = input.value / max * 100 + 1 + '%'
        mileStoneIndicator.textContent = Math.round(input.value * 1000 / max) + ' WPM';

        input.addEventListener('input', () => {
          const value = input.value;
          console.log('value', value)
          this.options.rate = value;
          
          const bottom = Math.min((value / max * 100), 94);
          fillBar.style.height = value / max * 100 + 1 + '%'
          mileStoneIndicator.style.bottom = bottom + '%';
          mileStoneIndicator.textContent = Math.round(value * 1000 / max) + ' WPM';
          
          // span.textContent = input.value;
          if (this.instance) {
            this.instance.rate = input.value;
            if (this.audio) {
              this.audio.playbackRate = input.value;
            }
          }
        });
        this.controls.rate = input;
      }

      this.buttons = {
        select,
        previous,
        play,
        next,
        stop
      };
    }
    create() {
      super.create();
      const selected = this.buttons.select.selectedOptions[0];
      if (selected) {
        this.voice(selected.voice);
      }
    }
    reset() {
      this.controls.rate.value = 1;
      this.controls.rate.dispatchEvent(new Event('input'));
      this.controls.volume.value = 1;
      this.controls.volume.dispatchEvent(new Event('input'));
      this.controls.pitch.value = 1;
      this.controls.pitch.dispatchEvent(new Event('input'));
    }
  }

  window.TTS = Intractive;
}

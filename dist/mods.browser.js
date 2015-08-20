(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _zmEventKit = require('zm-event-kit');

var Cache = new WeakMap();

var Dollar = (function () {
  function Dollar(el) {
    _classCallCheck(this, Dollar);

    this.el = el;
  }

  // External $

  _createClass(Dollar, [{
    key: 'ready',
    value: function ready(callback) {
      if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback.call(document);
      }
    }
  }, {
    key: 'on',
    value: function on(event, callback) {
      var _this = this;

      this.el.addEventListener(event, callback);
      return new _zmEventKit.Disposable(function () {
        return _this.el.removeEventListener(event, callback);
      });
    }
  }, {
    key: 'once',
    value: function once(event, callback) {
      var _this2 = this;

      var disposable = this.on(event, function (e) {
        return disposable.dispose() || callback.call(_this2, e);
      });
      return disposable;
    }
  }, {
    key: 'find',
    value: function find(selector) {
      return $(this.el.querySelector(selector));
    }
  }, {
    key: 'findAll',
    value: function findAll(selector) {
      return this.el.querySelectorAll(selector).map($);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.el.setAttribute('hidden', true);
      return this;
    }
  }, {
    key: 'show',
    value: function show() {
      this.el.removeAttribute('hidden');
      return this;
    }
  }, {
    key: 'toggleVisibility',
    value: function toggleVisibility() {
      if (this.el.hasAttribute('hidden')) this.show();else this.hide();
      return this;
    }
  }, {
    key: 'append',
    value: function append(obj) {
      this.el.appendChild(obj.el || obj);
      return this;
    }
  }, {
    key: 'appendTo',
    value: function appendTo(obj) {
      (obj.el || obj).appendChild(this.el);
      return this;
    }
  }, {
    key: 'prepend',
    value: function prepend(obj) {
      this.el.insertBefore(obj.el || obj, this.el.firstChild);
      return this;
    }
  }, {
    key: 'prependTo',
    value: function prependTo(obj) {
      obj = obj.el || obj;
      obj.insertBefore(this.el, obj.firstChild);
      return this;
    }
  }, {
    key: 'insertAfter',
    value: function insertAfter(target) {
      target = target || target.el;
      target.parentNode.insertBefore(this.el, target.nextSibling);
      return this;
    }
  }, {
    key: 'addClass',
    value: function addClass(name) {
      this.el.classList.add(name);
      return this;
    }
  }, {
    key: 'removeClass',
    value: function removeClass(name) {
      this.el.classList.remove(name);
      return this;
    }
  }, {
    key: 'hasClass',
    value: function hasClass(name) {
      return this.el.classList.contains(name);
    }
  }, {
    key: 'toggleClass',
    value: function toggleClass(name) {
      this.el.classList.toggle(name);
      return this;
    }
  }, {
    key: 'setText',
    value: function setText(text) {
      this.el.textContent = text;
      return this;
    }
  }, {
    key: 'setHTML',
    value: function setHTML(html) {
      this.el.innerHTML = html;
      return this;
    }
  }, {
    key: 'isInViewPort',
    value: function isInViewPort() {
      var rect = this.el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }
  }, {
    key: 'offset',
    value: function offset() {
      return this.el.getBoundingClientRect();
    }
  }, {
    key: 'closest',
    value: function closest(selector) {
      return $(this.el.closest(selector));
    }
  }, {
    key: 'trigger',
    value: function trigger(name, detail) {
      var event = undefined;
      if (!detail) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(name, true, false);
      } else {
        event = new CustomEvent(name, { detail: detail });
      }
      this.el.dispatchEvent(event);
      return event;
    }
  }, {
    key: 'onScrollToBottom',
    value: function onScrollToBottom(callback) {
      var _this3 = this;

      var disposable = $(document).on('scroll', function (e) {
        if (document.body.scrollHeight <= document.body.scrollTop + window.innerHeight + 1000) {
          disposable.dispose();
          return callback.call(_this3, e);
        }
      });
      return disposable;
    }
  }, {
    key: 'onScrollIntoView',
    value: function onScrollIntoView(callback) {
      var _this4 = this;

      $.setImmediate(function () {
        if (_this4.isInViewPort()) return callback.call(_this4);
        var frameRequest = null;
        var Disposable = document.on('scroll', function () {
          cancelAnimationFrame(frameRequest);
          frameRequest = requestAnimationFrame(function () {
            if (_this4.isInViewPort()) {
              Disposable.dispose();
              callback.call(_this4);
            }
          });
        });
      });
      return this;
    }
  }, {
    key: 'serializeAssoc',
    value: function serializeAssoc() {
      var ToReturn = {};
      var LFFix = /\r?\n/g;
      var SpaceFix = /%20/g;
      this.findAll('[name]').forEach(function (n) {
        if (!n.name || (n.type === 'checkbox' || n.type === 'radio') && !n.checked) {
          return;
        }
        ToReturn[n.name] = n.value.replace(LFFix, "\n").replace(SpaceFix, '+');
      });
      return ToReturn;
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return $.ajax.serialize(this.serializeAssoc());
    }
  }, {
    key: 'hasChild',
    value: function hasChild(el) {
      return el.parentNode === this.el;
    }
  }]);

  return Dollar;
})();

function $(element) {
  var el = undefined;
  if (typeof element === 'string') {
    el = document.querySelector(element);
  } else if (element && element.childNodes.constructor.name === 'NodeList') {
    el = element;
  }
  if (!el) return null;
  if (Cache.has(el)) {
    return Cache.get(el);
  } else {
    var dollar = new Dollar(el);
    Cache.set(el, dollar);
    return dollar;
  }
}
$.findAll = function (selector) {
  return document.querySelectorAll(selector).map($);
};
$.byClass = function (className, reference) {
  return (reference || document).getElementsByClassName(className).map($);
};
$.byTag = function (tagName, reference) {
  return (reference || document).getElementsByTagName(tagName).map($);
};
$.byId = function (id) {
  return $(document.getElementById(id));
};
$.ajax = function (Url, Method, Contents) {
  return new Promise(function (resolve, reject) {
    var XHR = new XMLHttpRequest();
    XHR.open(Method, Url, true);
    XHR.withCredentials = true;
    XHR.addEventListener('load', function () {
      if (XHR.status >= 200 && XHR.status < 400) {
        resolve(XHR.responseText);
      } else {
        reject({ code: XHR.status, response: XHR.responseText });
      }
    });
    XHR.addEventListener('error', reject);
    XHR.send(Contents);
  });
};
$.ajax.serialize = function (values) {
  var ToReturn = [];
  for (var i in values) {
    if (values[i] && typeof values[i] === 'object') {
      values[i] = window.ajax.serialize(values[i]);
    }
    ToReturn.push(i + '=' + encodeURIComponent(values[i]));
  }
  return ToReturn.join('&');
};
$.debounce = function (callback, delay) {
  var timeout = null;
  var toReturn = function toReturn(arg) {
    var _this5 = this;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      return callback.call(_this5, arg);
    }, delay);
  };
  toReturn.prototype = callback.prototype;
  return toReturn;
};
$.lock = function (callback) {
  var status = false;
  return function (arg) {
    var _this6 = this;

    if (status) return status;
    status = true;
    return new Promise(function (resovle) {
      resovle(callback.call(_this6, arg));
    }).then(function (val) {
      status = false;
      return val;
    });
  };
};
$.memoize = function (callback) {
  var cache = {};
  var toReturn = function toReturn(arg) {
    return cache[arg] ? cache[arg] : cache[arg] = callback.call(this, arg);
  };
  toReturn.prototype = callback.prototype;
  return toReturn;
};
$.extend = function () {
  var toReturn = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  for (var i = 1; i <= arguments.length; ++i) {
    var argument = arguments[i];
    for (var prop in argument) {
      if (Object.prototype.hasOwnProperty.call(argument, prop)) {
        toReturn[prop] = argument[prop];
      }
    }
  }
  return toReturn;
};
$.setImmediate = function (func) {
  setTimeout(func, 0);
};
$.reload = function () {
  var timeout = arguments.length <= 0 || arguments[0] === undefined ? 2000 : arguments[0];

  setTimeout(function () {
    return location.reload();
  }, timeout);
};
$.getLocationParam = function (key) {
  var value = new RegExp('[?&]' + key + '=[^&]+').exec(location.search);
  return !!value ? decodeURIComponent(value.toString().replace(/^[^=]+./, '')) : false;
};
// $.fn --> Dollar.prototype
$.fn = Dollar.prototype;

// Some prototype mods
Array.prototype.last = function () {
  return this[this.length - 1];
};
Array.prototype.at = function (index) {
  if (index >= 0) {
    return this[index];
  } else {
    return this[this.length + index - 1];
  }
};
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
  return this;
};
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = HTMLFormControlsCollection.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.indexOf = HTMLCollection.prototype.indexOf = HTMLFormControlsCollection.prototype.indexOf = Array.prototype.indexOf;
NodeList.prototype.last = HTMLCollection.prototype.last = HTMLFormControlsCollection.prototype.last = Array.prototype.last;
NodeList.prototype.at = HTMLCollection.prototype.at = HTMLFormControlsCollection.prototype.at = Array.prototype.at;
NodeList.prototype.map = HTMLCollection.prototype.map = HTMLFormControlsCollection.prototype.map = Array.prototype.map;['id', 'className', 'textContent', 'innerHTML', 'title', 'name', 'value', 'checked', 'selected'].forEach(function (entry) {
  Object.defineProperty(Dollar.prototype, entry, {
    get: function get() {
      return this.el[entry];
    },
    set: function set(value) {
      this.el[entry] = value;
      return this;
    }
  });
});['classList', 'style', 'dataset', 'childNodes', 'children', 'firstElementChild', 'lastElementChild', 'firstChild', 'lastChild', 'parentNode'].forEach(function (entry) {
  Object.defineProperty(Dollar.prototype, entry, {
    get: function get() {
      return this.el[entry];
    }
  });
});['addEventListener', 'removeEventListener', 'remove', 'matches', 'blur', 'focus', 'getAttribute', 'setAttribute', 'hasAttribute', 'removeAttribute', 'dispatchEvent'].forEach(function (entry) {
  Object.defineProperty(Dollar.prototype, entry, {
    value: function value() {
      var retValue = this.el[entry].apply(this.el, arguments);
      if (typeof retValue === 'undefined') retValue = this;
      return retValue;
    }
  });
});

module.exports = $;

},{"zm-event-kit":5}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var CompositeDisposable = (function () {
  function CompositeDisposable() {
    _classCallCheck(this, CompositeDisposable);

    this.disposed = false;
    this.disposables = new Set(arguments);
  }

  _createClass(CompositeDisposable, [{
    key: "dispose",
    value: function dispose() {
      if (this.disposed) return;
      this.disposed = true;
      this.disposables.forEach(function (item) {
        return item.dispose();
      });
      this.disposables = null;
    }
  }, {
    key: "add",
    value: function add() {
      var _this = this;

      if (this.disposed) return;
      Array.prototype.forEach.call(arguments, function (item) {
        return _this.disposables.add(item);
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;

      if (this.disposed) return;
      Array.prototype.forEach.call(arguments, function (item) {
        return _this2.disposables["delete"](item);
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.disposed) return;
      this.disposables.clear();
    }
  }]);

  return CompositeDisposable;
})();

module.exports = CompositeDisposable;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var Disposable = (function () {
  function Disposable(callback) {
    _classCallCheck(this, Disposable);

    this.disposed = false;
    this.callback = callback;
  }

  _createClass(Disposable, [{
    key: 'dispose',
    value: function dispose() {
      if (this.disposed) return;
      if (typeof this.callback === 'function') {
        this.callback();
      }
      this.callback = null;
      this.disposed = true;
    }
  }]);

  return Disposable;
})();

module.exports = Disposable;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var Disposable = require('./Disposable');

var Emitter = (function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this.disposed = false;
    this.handlersByEventName = {};
  }

  _createClass(Emitter, [{
    key: 'dispose',
    value: function dispose() {
      this.disposed = true;
      this.handlersByEventName = null;
    }
  }, {
    key: 'on',
    value: function on(eventName, handler) {
      var _this = this;

      if (this.disposed) throw new Error('Emitter has been disposed');
      if (typeof handler !== 'function') throw new Error('Handler must be a function');
      if (this.handlersByEventName.hasOwnProperty(eventName)) {
        this.handlersByEventName[eventName].push(handler);
      } else {
        this.handlersByEventName[eventName] = [handler];
      }
      return new Disposable(function () {
        return _this.off(eventName, handler);
      });
    }
  }, {
    key: 'off',
    value: function off(eventName, handler) {
      if (this.disposed || !this.handlersByEventName.hasOwnProperty(eventName)) return;
      var Index = undefined;
      if ((Index = this.handlersByEventName[eventName].indexOf(handler)) !== -1) {
        this.handlersByEventName[eventName].splice(Index, 1);
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.handlersByEventName = {};
    }
  }, {
    key: 'emit',
    value: function emit(eventName, value) {
      if (this.disposed || !this.handlersByEventName.hasOwnProperty(eventName)) return;
      this.handlersByEventName[eventName].forEach(function (callback) {
        return callback(value);
      });
    }
  }]);

  return Emitter;
})();

module.exports = Emitter;

},{"./Disposable":3}],5:[function(require,module,exports){
'use strict';

var EventKit = {
  CompositeDisposable: require('./CompositeDisposable'),
  Disposable: require('./Disposable'),
  Emitter: require('./Emitter')
};
module.exports = EventKit;

},{"./CompositeDisposable":2,"./Disposable":3,"./Emitter":4}],6:[function(require,module,exports){
'use strict';

window.$ = require('./mods');

},{"./mods":1}]},{},[6]);

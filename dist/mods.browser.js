(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _zmEventKit = require('zm-event-kit');

// Document
Document.prototype.ready = function (callback) {
  if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback.call(document);
  }
};
Document.prototype.onScrollToBottom = function (callback) {
  var _this = this;

  var disposable = this.on('scroll', function (e) {
    if (_this.body.scrollHeight <= _this.body.scrollTop + window.innerHeight + 1000) {
      disposable.dispose();
      return callback.call(_this, e);
    }
  });
  return disposable;
};
Document.prototype.findAll = function (selector) {
  return document.querySelectorAll(selector);
};
Document.prototype.byClass = function (className) {
  return this.getElementsByClassName(className);
};
Document.prototype.byTag = function (tagName) {
  return this.getElementsByTagName(tagName);
};
Document.prototype.byId = function (id) {
  return document.getElementById(id);
};
// Element
Element.prototype.on = function (event, callback) {
  var _this2 = this;

  this.addEventListener(event, callback);
  return new _zmEventKit.Disposable(function () {
    return _this2.removeEventListener(event, callback);
  });
};
Element.prototype.once = function (event, callback) {
  var _this3 = this;

  var disposable = this.on(event, function (e) {
    return disposable.dispose() || callback.call(_this3, e);
  });
  return disposable;
};
Element.prototype.find = function (selector) {
  return this.querySelector(selector);
};
Element.prototype.findAll = function (selector) {
  return this.querySelectorAll(selector);
};
Element.prototype.hide = function () {
  this.setAttribute('hidden', true);
  return this;
};
Element.prototype.show = function () {
  this.removeAttribute('hidden');
  return this;
};
Element.prototype.toggleVisibility = function () {
  if (this.hasAttribute('hidden')) this.show();else this.hide();
  return this;
};
Element.prototype.append = function (obj) {
  this.appendChild(obj);
  return this;
};
Element.prototype.appendTo = function (obj) {
  obj.appendChild(this);
  return this;
};
Element.prototype.prepend = function (obj) {
  this.insertBefore(obj, this.firstChild);
  return this;
};
Element.prototype.prependTo = function (obj) {
  obj.insertBefore(this, obj.firstChild);
  return this;
};
Element.prototype.addClass = function (name) {
  this.classList.add(name);
  return this;
};
Element.prototype.removeClass = function (name) {
  this.classList.remove(name);
  return this;
};
Element.prototype.hasClass = function (name) {
  return this.classList.contains(name);
};
Element.prototype.removeClass = function (name) {
  this.classList.remove(name);
  return this;
};
Element.prototype.toggleClass = function (name) {
  this.classList.toggle(name);
  return this;
};
Element.prototype.setText = function (text) {
  this.textContent = text;
  return this;
};
Element.prototype.setHTML = function (html) {
  this.innerHTML = html;
  return this;
};
Element.prototype.isInViewPort = function () {
  var rect = this.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
};
Element.prototype.trigger = function (name, detail) {
  var event = undefined;
  if (!detail) {
    event = document.createEvent('HTMLEvents');
    event.initEvent(name, true, false);
  } else {
    event = new CustomEvent(name, { detail: detail });
  }
  this.dispatchEvent(event);
  return event;
};
Element.prototype.onScrollIntoView = function (callback) {
  var _this4 = this;

  setImmediate(function () {
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
};
Element.prototype.serializeAssoc = function () {
  var ToReturn = {};
  var LFFix = /\r?\n/g;
  var SpaceFix = /%20/g;
  this.findAll('[name]').forEach(function (n) {
    if (!n.name || (n.type === 'checkbox' || n.type === 'radio') && !n.checked || typeof n.value !== 'string') {
      return;
    }
    ToReturn[n.name] = n.value.replace(LFFix, "\n").replace(SpaceFix, '+');
  });
  return ToReturn;
};
Element.prototype.serialize = function () {
  return ajax.serialize(this.serializeAssoc());
};
Element.prototype.setAttr = function (name, value) {
  this.setAttribute(name, value);
  return this;
};
Element.prototype.removeAttr = function (name) {
  this.removeAttribute(name);
  return this;
};
window.ajax = function (Url, Method, Contents) {
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
window.ajax.serialize = function (values) {
  var ToReturn = [];
  for (var i in values) {
    if (values[i] && typeof values[i] === 'object') {
      values[i] = window.ajax.serialize(values[i]);
    }
    ToReturn.push(i + '=' + encodeURIComponent(values[i]));
  }
  return ToReturn.join('&');
};
window.debounce = function (callback, delay) {
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
window.lock = function (callback) {
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
window.memoize = function (callback) {
  var cache = {};
  var toReturn = function toReturn(arg) {
    return cache[arg] ? cache[arg] : cache[arg] = callback.call(this, arg);
  };
  toReturn.prototype = callback.prototype;
  return toReturn;
};
window.extend = function () {
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
window.setImmediate = function (func) {
  setTimeout(func, 0);
};
window.reload = function () {
  var timeout = arguments.length <= 0 || arguments[0] === undefined ? 2000 : arguments[0];

  setTimeout(function () {
    return location.reload();
  }, timeout);
};
window.getLocationParam = function (key) {
  var value = new RegExp('[?&]' + key + '=[^&]+').exec(location.search);
  return !!value ? decodeURIComponent(value.toString().replace(/^[^=]+./, '')) : false;
};

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
NodeList.prototype.map = HTMLCollection.prototype.map = HTMLFormControlsCollection.prototype.map = Array.prototype.map;

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

module.exports = {
  CompositeDisposable: require('./CompositeDisposable'),
  Disposable: require('./Disposable'),
  Emitter: require('./Emitter')
};

},{"./CompositeDisposable":2,"./Disposable":3,"./Emitter":4}]},{},[1]);

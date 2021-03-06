require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"js-mods":[function(require,module,exports){
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
Document.prototype.find = function (selector) {
  return this.querySelector(selector);
};
Document.prototype.findAll = function (selector) {
  return this.querySelectorAll(selector);
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
// EventTarget
EventTarget.prototype.on = function (event, callback) {
  var _this2 = this;

  this.addEventListener(event, callback);
  return new _zmEventKit.Disposable(function () {
    return _this2.removeEventListener(event, callback);
  });
};
EventTarget.prototype.once = function (event, callback) {
  var _this3 = this;

  var disposable = this.on(event, function (e) {
    return disposable.dispose() || callback.call(_this3, e);
  });
  return disposable;
};
// Element
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
  var Headers = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

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
    for (var key in Headers) {
      XHR.setRequestHeader(key, Headers[key]);
    }
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
[Array.prototype, NodeList.prototype, HTMLCollection.prototype, HTMLFormControlsCollection.prototype].forEach(function (proto) {
  Object.defineProperty(proto, 'last', {
    get: function get() {
      return this[this.length - 1];
    }
  });
});

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
NodeList.prototype.at = HTMLCollection.prototype.at = HTMLFormControlsCollection.prototype.at = Array.prototype.at;
NodeList.prototype.map = HTMLCollection.prototype.map = HTMLFormControlsCollection.prototype.map = Array.prototype.map;
},{"zm-event-kit":"zm-event-kit"}]},{},[]);

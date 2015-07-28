"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
    require('./document')(Document.prototype);
    require('./element')(Element.prototype);
    require('./element-form')(HTMLFormElement.prototype);
    require('./event-kit')(window);
    require('./event-target')(EventTarget.prototype);
    require('./misc')();
    require('./window')(window);
  }, { "./document": 2, "./element": 4, "./element-form": 3, "./event-kit": 5, "./event-target": 6, "./misc": 7, "./window": 8 }], 2: [function (require, module, exports) {
    module.exports = function (Prototype) {
      Prototype.byId = Prototype.getElementById;
      Prototype.byClass = Prototype.getElementsByClassName;
      Prototype.byTag = Prototype.getElementsByTagName;
      Prototype.find = Prototype.querySelector;
      Prototype.findAll = Prototype.querySelectorAll;
      Prototype.Ready = function (Callback) {
        this.readyState === "complete" || this.readyState === 'interactive' ? Callback() : this.on('DOMContentLoaded', Callback);
      };
      Prototype.onScrollToBottom = function (Callback) {
        var _this = this;

        var InProgress = false;
        var Watcher = function Watcher(e) {
          if (InProgress) return;
          if (_this.body.scrollHeight <= _this.body.scrollTop + window.innerHeight + 1000) {
            InProgress = true;new Promise(function (resolve) {
              return resolve(Callback(e));
            }).then(function () {
              return InProgress = false;
            });
          }
        };
        return this.on('scroll', Watcher);
      };
    };
  }, {}], 3: [function (require, module, exports) {
    module.exports = function (Prototype) {
      Prototype.serialize = function () {
        return Ajax.Serialize(this.serializeAssoc());
      };
      Prototype.serializeAssoc = function () {
        var ToReturn = {};
        var LFFix = /\r?\n/g;
        var SpaceFix = /%20/g;
        for (var i = 0; i < this.elements.length; ++i) {
          var n = this.elements[i];
          if (!n.name || (n.type === 'checkbox' || n.type === 'radio') && !n.checked) {
            continue;
          }
          ToReturn[n.name] = n.value.replace(LFFix, "\n").replace(SpaceFix, '+');
        }
        return ToReturn;
      };
    };
  }, {}], 4: [function (require, module, exports) {
    "use strict";
    module.exports = function (Prototype) {
      Prototype.byClass = Prototype.getElementsByClassName;
      Prototype.byTag = Prototype.getElementsByTagName;
      Prototype.find = Prototype.querySelector;
      Prototype.findAll = Prototype.querySelectorAll;
      Prototype.hide = function () {
        this.setAttribute('hidden', true);
        return this;
      };
      Prototype.show = function () {
        this.removeAttribute('hidden');
        return this;
      };
      Prototype.toggleVisibility = function () {
        if (this.hasAttribute('hidden')) {
          this.show();
        } else {
          this.hide();
        }
      };
      Prototype.setAttr = function (key, value) {
        this.setAttribute(key, value);
        return this;
      };
      Prototype.removeAttr = function (key) {
        this.removeAttribute(key);
        return this;
      };
      Prototype.append = function (item) {
        this.appendChild(item);
        return this;
      };
      Prototype.appendTo = function (item) {
        item.appendChild(this);
        return this;
      };
      Prototype.prepend = function (item) {
        this.insertBefore(item, this.firstChild);
        return this;
      };
      Prototype.prependTo = function (item) {
        item.prepend(this);
        return this;
      };
      Prototype.insertAfter = function (item) {
        item.parentNode.insertBefore(this, item.nextSibling);
        return this;
      };
      Prototype.addClass = function (name) {
        this.classList.add(name);
        return this;
      };
      Prototype.removeClass = function (name) {
        this.classList.remove(name);
        return this;
      };
      Prototype.hasClass = function (name) {
        return this.classList.contains(name);
      };
      Prototype.toggleClass = function (name) {
        this.classList.toggle(name);
        return this;
      };
      Prototype.setText = function (text) {
        this.textContent = text;
        return this;
      };
      Prototype.setHTML = function (html) {
        this.innerHTML = html;
        return this;
      };
      Prototype.isInViewPort = function () {
        var rect = this.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      };
      Prototype.onScrollIntoView = function (callback) {
        var _this2 = this;

        setImmediate(function () {
          if (_this2.isInViewPort()) return callback.call(_this2);
          var frameRequest = null;
          var onScroll = function onScroll() {
            cancelAnimationFrame(frameRequest);
            frameRequest = requestAnimationFrame(function () {
              if (_this2.isInViewPort()) {
                document.off('scroll', onScroll);
                callback.call(_this2);
              }
            });
          };
          document.on('scroll', onScroll);
        });
      };
      Prototype.trigger = function (name, detail) {
        var event = undefined;
        if (!data) {
          event = document.createEvent('HTMLEvents');
          event.initEvent(name, true, false);
        } else {
          if (window.CustomEvent) {
            event = new CustomEvent(name, { detail: detail });
          } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(name, true, true, detail);
          }
        }
        this.dispatchEvent(event);
        return event;
      };
    };
  }, {}], 5: [function (require, module, exports) {
    module.exports = function (window) {
      var EventKit = require('zm-event-kit/src/EventKit.js');
      window.Emitter = EventKit.Emitter;
      window.Disposable = EventKit.Disposable;
      window.CompositeDisposable = EventKit.CompositeDisposable;
    };
  }, { "zm-event-kit/src/EventKit.js": 12 }], 6: [function (require, module, exports) {
    module.exports = function (Prototype) {
      Prototype.on = function (event, callback) {
        var _this3 = this;

        this.addEventListener(event, callback);
        return new Disposable(function () {
          return _this3.removeEventListener(event, callback);
        });
      };
      Prototype.once = function (name, callback) {
        var _this4 = this;

        var realCallback = function realCallback(e) {
          return _this4.removeEventListener(name, realCallback) || callback.call(_this4, e);
        };
        this.on(name, realCallback);
        return new Disposable(function () {
          return _this4.removeEventListener(event, realCallback);
        });
      };
    };
  }, {}], 7: [function (require, module, exports) {
    module.exports = function () {
      NodeList.prototype.forEach = HTMLCollection.prototype.forEach = HTMLFormControlsCollection.prototype.forEach = Array.prototype.forEach;
      NodeList.prototype.indexOf = HTMLCollection.prototype.indexOf = HTMLFormControlsCollection.prototype.indexOf = Array.prototype.indexOf;
      Promise.prototype["finally"] = function (callback) {
        return this.then(function (result) {
          return callback(null, result);
        }, function (error) {
          return callback(error);
        });
      };
      Location.prototype.getParam = function (key) {
        var value = new RegExp('[?&]' + key + '=[^&]+').exec(this.search);
        return !!value ? decodeURIComponent(value.toString().replace(/^[^=]+./, '')) : false;
      };
    };
  }, {}], 8: [function (require, module, exports) {
    module.exports = function (window) {
      window.Ajax = function (Url, Method, Contents) {
        var XHR = new XMLHttpRequest();
        var Deferred = Promise.defer();
        XHR.open(Method, Url, true);
        XHR.withCredentials = true;
        XHR.addEventListener('load', function () {
          if (XHR.status >= 200 && XHR.status < 400) {
            Deferred.resolve(XHR.responseText, XHR);
          } else {
            Deferred.reject(new Error("HTTP Error"));
          }
        });
        XHR.addEventListener('error', Deferred.reject);
        XHR.send(Contents);
        return Deferred.promise;
      };
      window.Ajax.Serialize = function (values) {
        var ToReturn = [];
        for (var i in values) {
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
      window.memoize = function (callback) {
        var cache = {};
        var toReturn = function toReturn(arg) {
          return cache[arg] ? cache[arg] : cache[arg] = callback.call(this, arg);
        };
        toReturn.prototype = callback.prototype;
        return toReturn();
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
    };
  }, {}], 9: [function (require, module, exports) {
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
          var _this6 = this;

          if (this.disposed) return;
          Array.prototype.forEach.call(arguments, function (item) {
            return _this6.disposables.add(item);
          });
        }
      }, {
        key: "remove",
        value: function remove() {
          var _this7 = this;

          if (this.disposed) return;
          Array.prototype.forEach.call(arguments, function (item) {
            return _this7.disposables["delete"](item);
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
  }, {}], 10: [function (require, module, exports) {
    var Disposable = (function () {
      function Disposable(callback) {
        _classCallCheck(this, Disposable);

        this.disposed = false;
        this.callback = callback;
      }

      _createClass(Disposable, [{
        key: "dispose",
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
  }, {}], 11: [function (require, module, exports) {
    var Disposable = require('./Disposable');

    var Emitter = (function () {
      function Emitter() {
        _classCallCheck(this, Emitter);

        this.disposed = false;
        this.handlersByEventName = {};
      }

      _createClass(Emitter, [{
        key: "dispose",
        value: function dispose() {
          this.disposed = true;
          this.handlersByEventName = null;
        }
      }, {
        key: "on",
        value: function on(eventName, handler) {
          var _this8 = this;

          if (this.disposed) throw new Error('Emitter has been disposed');
          if (typeof handler !== 'function') throw new Error('Handler must be a function');
          if (this.handlersByEventName.hasOwnProperty(eventName)) {
            this.handlersByEventName[eventName].push(handler);
          } else {
            this.handlersByEventName[eventName] = [handler];
          }
          return new Disposable(function () {
            return _this8.off(eventName, handler);
          });
        }
      }, {
        key: "off",
        value: function off(eventName, handler) {
          if (this.disposed || !this.handlersByEventName.hasOwnProperty(eventName)) return;
          var Index = undefined;
          if ((Index = this.handlersByEventName[eventName].indexOf(handler)) !== -1) {
            this.handlersByEventName[eventName].splice(Index, 1);
          }
        }
      }, {
        key: "clear",
        value: function clear() {
          this.handlersByEventName = {};
        }
      }, {
        key: "emit",
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
  }, { "./Disposable": 10 }], 12: [function (require, module, exports) {
    var EventKit = {
      CompositeDisposable: require('./CompositeDisposable'),
      Disposable: require('./Disposable'),
      Emitter: require('./Emitter')
    };
    module.exports = EventKit;
  }, { "./CompositeDisposable": 9, "./Disposable": 10, "./Emitter": 11 }] }, {}, [1]);
import {Disposable} from 'zm-event-kit'
const Cache = new WeakMap()

class Dollar {
  constructor(el) {
    this.el = el
  }
  ready(callback) {
    if (document.readyState !== 'complete') {
      document.addEventListener('DOMContentLoaded', callback)
    } else {
      callback.call(document)
    }
  }
  on(event, callback) {
    this.el.addEventListener(event, callback)
    return new Disposable(() =>
        this.el.removeEventListener(event, callback)
    )
  }
  once(event, callback) {
    var disposable = this.on(event, e =>
      disposable.dispose() ||
      callback.call(this, e)
    )
    return disposable
  }
  find(selector) {
    return $(this.el.querySelector(selector))
  }
  findAll(selector) {
    return this.el.querySelectorAll(selector).map($)
  }
  hide() {
    this.el.setAttribute('hidden', true)
    return this
  }
  show() {
    this.el.removeAttribute('hidden')
    return this
  }
  toggleVisibility() {
    if (this.el.hasAttribute('hidden'))
      this.show()
    else
      this.hide()
    return this
  }
  append(obj) {
    this.el.appendChild(obj.el || obj)
    return this
  }
  appendTo(obj) {
    (obj.el || obj).appendChild(this.el)
    return this
  }
  prepend(obj) {
    this.el.insertBefore(obj.el || obj, this.el.firstChild)
    return this
  }
  prependTo(obj) {
    obj = obj.el || obj
    obj.insertBefore(this.el, obj.firstChild)
    return this
  }
  insertAfter(target) {
    target = target || target.el
    target.parentNode.insertBefore(this.el, target.nextSibling)
    return this
  }
  addClass(name) {
    this.el.classList.add(name)
    return this
  }
  removeClass(name) {
    this.el.classList.remove(name)
    return this
  }
  hasClass(name) {
    return this.el.classList.contains(name)
  }
  toggleClass(name) {
    this.el.classList.toggle(name)
    return this
  }
  setText(text) {
    this.el.textContent = text
    return this
  }
  setHTML(html) {
    this.el.innerHTML = html
    return this
  }
  isInViewPort() {
    var rect = this.el.getBoundingClientRect()
    return rect.top >= 0 && rect.bottom <= window.innerHeight
  }
  offset() {
    return this.el.getBoundingClientRect()
  }
  closest(selector) {
    return $(this.el.closest(selector))
  }
  trigger(name, detail) {
    let event
    if(!detail){
      event = document.createEvent('HTMLEvents')
      event.initEvent(name, true, false)
    } else {
      event = new CustomEvent(name, {detail})
    }
    this.el.dispatchEvent(event)
    return event
  }
  onScrollToBottom(callback) {
    var disposable = $(document).on('scroll', e => {
      if(document.body.scrollHeight <= document.body.scrollTop + window.innerHeight + 1000) {
        disposable.dispose()
        return callback.call(this, e)
      }
    })
    return disposable
  }
  onScrollIntoView(callback) {
    $.setImmediate(() => {
      if (this.isInViewPort()) return callback.call(this)
      var frameRequest = null
      var Disposable = document.on('scroll', () => {
        cancelAnimationFrame(frameRequest)
        frameRequest = requestAnimationFrame(() => {
          if(this.isInViewPort()){
            Disposable.dispose()
            callback.call(this)
          }
        })
      })
    })
    return this
  }
  serializeAssoc() {
    const ToReturn = {}
    const LFFix = /\r?\n/g
    const SpaceFix = /%20/g
    this.findAll('[name]').forEach(n => {
      if (!n.name || ((n.type === 'checkbox' || n.type === 'radio') && !n.checked)) {
        return
      }
      ToReturn[n.name] = n.value.replace(LFFix, "\n").replace(SpaceFix, '+')
    })
    return ToReturn
  }
  serialize() {
    return $.ajax.serialize(this.serializeAssoc())
  }
  hasChild(el) {
    return el.parentNode === this.el
  }
}
// External $
function $(element) {
  let el
  if (typeof element === 'string') {
    el = document.querySelector(element)
  } else if (element && element.childNodes.constructor.name === 'NodeList') {
    el = element
  }
  if (!el) return null
  if (Cache.has(el)) {
    return Cache.get(el)
  } else {
    const dollar = new Dollar(el)
    Cache.set(el, dollar)
    return dollar
  }
}
$.findAll = function(selector) {
  return document.querySelectorAll(selector).map($)
}
$.byClass = function(className, reference) {
  return (reference || document).getElementsByClassName(className).map($)
}
$.byTag = function(tagName, reference) {
  return (reference || document).getElementsByTagName(tagName).map($)
}
$.byId = function(id) {
  return $(document.getElementById(id))
}
$.ajax = function(Url, Method, Contents) {
  return new Promise(function(resolve, reject) {
    const XHR = new XMLHttpRequest()
    XHR.open(Method, Url, true)
    XHR.withCredentials = true
    XHR.addEventListener('load', () => {
      if (XHR.status >= 200 && XHR.status < 400) {
        resolve(XHR.responseText)
      } else {
        reject({code: XHR.status, response: XHR.responseText})
      }
    })
    XHR.addEventListener('error', reject)
    XHR.send(Contents)
  })
}
$.ajax.serialize = function(values) {
  const ToReturn = []
  for (var i in values) {
    if (values[i] && typeof values[i] === 'object') {
      values[i] = window.ajax.serialize(values[i])
    }
    ToReturn.push(i + '=' + encodeURIComponent(values[i]))
  }
  return ToReturn.join('&')
}
$.debounce = function(callback, delay) {
  let timeout = null
  const toReturn = function(arg) {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.call(this, arg), delay)
  }
  toReturn.prototype = callback.prototype
  return toReturn
}
$.lock = function(callback) {
  let status = false
  return function(arg) {
    if (status) return status
    status = true
    return new Promise(resovle => {
      resovle(callback.call(this, arg))
    })
    .then(val => {
      status = false
      return val
    })
  }
}
$.memoize = function(callback) {
  const cache = {}
  const toReturn = function(arg) {
    return cache[arg] ? cache[arg] : cache[arg] = callback.call(this, arg)
  }
  toReturn.prototype = callback.prototype
  return toReturn
}
$.extend = function(toReturn = {}) {
  for (let i = 1; i <= arguments.length; ++i) {
    const argument = arguments[i];
    for (let prop in argument) {
      if (Object.prototype.hasOwnProperty.call(argument, prop)) {
        toReturn[prop] = argument[prop]
      }
    }
  }
  return toReturn;
}
$.setImmediate = function(func) {
  setTimeout(func, 0)
}
$.reload = function(timeout = 2000) {
  setTimeout(() => location.reload(), timeout)
}
$.getLocationParam = function(key){
  let value = new RegExp('[?&]'+key+'=[^&]+').exec(location.search)
  return !!value ? decodeURIComponent(value.toString().replace(/^[^=]+./,'')) : false
}
// $.fn --> Dollar.prototype
$.fn = Dollar.prototype

// Some prototype mods
Array.prototype.last = function(){
  return this[this.length - 1]
}
Array.prototype.at = function(index){
  if(index >= 0){
    return this[index]
  } else {
    return this[this.length + index - 1]
  }
}
Array.prototype.insert = function(index, item){
  this.splice(index, 0, item)
  return this
}
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = HTMLFormControlsCollection.prototype.forEach = Array.prototype.forEach
NodeList.prototype.indexOf = HTMLCollection.prototype.indexOf = HTMLFormControlsCollection.prototype.indexOf = Array.prototype.indexOf
NodeList.prototype.last = HTMLCollection.prototype.last = HTMLFormControlsCollection.prototype.last = Array.prototype.last
NodeList.prototype.at = HTMLCollection.prototype.at = HTMLFormControlsCollection.prototype.at = Array.prototype.at
NodeList.prototype.map = HTMLCollection.prototype.map = HTMLFormControlsCollection.prototype.map = Array.prototype.map

;['id', 'className', 'textContent', 'innerHTML', 'title', 'name', 'value', 'checked', 'selected'].forEach(entry => {
  Object.defineProperty(Dollar.prototype, entry, {
    get: function() {
      return this.el[entry]
    },
    set: function(value) {
      this.el[entry] = value
      return this
    }
  })
})
;['classList', 'style', 'dataset', 'childNodes', 'children', 'firstElementChild', 'lastElementChild', 'firstChild', 'lastChild', 'parentNode'].forEach(entry => {
  Object.defineProperty(Dollar.prototype, entry, {
    get: function() {
      return this.el[entry]
    }
  })
})
;['addEventListener', 'removeEventListener', 'remove', 'matches', 'blur', 'focus', 'getAttribute', 'setAttribute', 'hasAttribute', 'removeAttribute'].forEach(entry => {
  Object.defineProperty(Dollar.prototype, entry, {
    value: function() {
      let retValue = this.el[entry].apply(this.el, arguments)
      if (typeof retValue === 'undefined') retValue = this
      return retValue
    }
  })
})

module.exports = $

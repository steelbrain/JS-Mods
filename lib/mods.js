// @Compiler-Babel "true"
import {Disposable} from 'zm-event-kit'

// Document
Document.prototype.ready = function(callback) {
  if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', callback)
  } else {
    callback.call(document)
  }
}
Document.prototype.onScrollToBottom = function(callback) {
  var disposable = this.on('scroll', e => {
    if(this.body.scrollHeight <= this.body.scrollTop + window.innerHeight + 1000) {
      disposable.dispose()
      return callback.call(this, e)
    }
  })
  return disposable
}
Document.prototype.findAll = function(selector) {
  return document.querySelectorAll(selector)
}
Document.prototype.byClass = function(className) {
  return this.getElementsByClassName(className)
}
Document.prototype.byTag = function(tagName) {
  return this.getElementsByTagName(tagName)
}
Document.prototype.byId = function(id) {
  return document.getElementById(id)
}
// EventTarget
EventTarget.prototype.on = function(event, callback) {
  this.addEventListener(event, callback)
  return new Disposable(() =>
      this.removeEventListener(event, callback)
  )
}
EventTarget.prototype.once = function(event, callback) {
  var disposable = this.on(event, e =>
    disposable.dispose() ||
    callback.call(this, e)
  )
  return disposable
}
// Element
Element.prototype.find = function(selector) {
  return this.querySelector(selector)
}
Element.prototype.findAll = function(selector) {
  return this.querySelectorAll(selector)
}
Element.prototype.hide = function() {
  this.setAttribute('hidden', true)
  return this
}
Element.prototype.show = function() {
  this.removeAttribute('hidden')
  return this
}
Element.prototype.toggleVisibility = function() {
  if (this.hasAttribute('hidden'))
    this.show()
  else
    this.hide()
  return this
}
Element.prototype.append = function(obj) {
  this.appendChild(obj)
  return this
}
Element.prototype.appendTo = function(obj) {
  obj.appendChild(this)
  return this
}
Element.prototype.prepend = function(obj) {
  this.insertBefore(obj, this.firstChild)
  return this
}
Element.prototype.prependTo = function(obj) {
  obj.insertBefore(this, obj.firstChild)
  return this
}
Element.prototype.addClass = function(name) {
  this.classList.add(name)
  return this
}
Element.prototype.removeClass = function(name) {
  this.classList.remove(name)
  return this
}
Element.prototype.hasClass = function(name) {
  return this.classList.contains(name)
}
Element.prototype.removeClass = function(name) {
  this.classList.remove(name)
  return this
}
Element.prototype.toggleClass = function(name) {
  this.classList.toggle(name)
  return this
}
Element.prototype.setText = function(text) {
  this.textContent = text
  return this
}
Element.prototype.setHTML = function(html) {
  this.innerHTML = html
  return this
}
Element.prototype.isInViewPort = function() {
  var rect = this.getBoundingClientRect()
  return rect.top >= 0 && rect.bottom <= window.innerHeight
}
Element.prototype.trigger = function(name, detail) {
  let event
  if(!detail){
    event = document.createEvent('HTMLEvents')
    event.initEvent(name, true, false)
  } else {
    event = new CustomEvent(name, {detail})
  }
  this.dispatchEvent(event)
  return event
}
Element.prototype.onScrollIntoView = function(callback) {
  setImmediate(() => {
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
Element.prototype.serializeAssoc = function() {
  const ToReturn = {}
  const LFFix = /\r?\n/g
  const SpaceFix = /%20/g
  this.findAll('[name]').forEach(n => {
    if (!n.name || ((n.type === 'checkbox' || n.type === 'radio') && !n.checked) || typeof n.value !== 'string') {
      return
    }
    ToReturn[n.name] = n.value.replace(LFFix, "\n").replace(SpaceFix, '+')
  })
  return ToReturn
}
Element.prototype.serialize = function() {
  return ajax.serialize(this.serializeAssoc())
}
Element.prototype.setAttr = function(name, value){
  this.setAttribute(name, value)
  return this
}
Element.prototype.removeAttr = function(name) {
  this.removeAttribute(name)
  return this
}
window.ajax = function(Url, Method, Contents) {
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
window.ajax.serialize = function(values) {
  const ToReturn = []
  for (var i in values) {
    if (values[i] && typeof values[i] === 'object') {
      values[i] = window.ajax.serialize(values[i])
    }
    ToReturn.push(i + '=' + encodeURIComponent(values[i]))
  }
  return ToReturn.join('&')
}
window.debounce = function(callback, delay) {
  let timeout = null
  const toReturn = function(arg) {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.call(this, arg), delay)
  }
  toReturn.prototype = callback.prototype
  return toReturn
}
window.lock = function(callback) {
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
window.memoize = function(callback) {
  const cache = {}
  const toReturn = function(arg) {
    return cache[arg] ? cache[arg] : cache[arg] = callback.call(this, arg)
  }
  toReturn.prototype = callback.prototype
  return toReturn
}
window.extend = function(toReturn = {}) {
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
window.setImmediate = function(func) {
  setTimeout(func, 0)
}
window.reload = function(timeout = 2000) {
  setTimeout(() => location.reload(), timeout)
}
window.getLocationParam = function(key){
  let value = new RegExp('[?&]'+key+'=[^&]+').exec(location.search)
  return !!value ? decodeURIComponent(value.toString().replace(/^[^=]+./,'')) : false
}

// Some prototype mods
; [Array.prototype, NodeList.prototype, HTMLCollection.prototype, HTMLFormControlsCollection.prototype].forEach(function(proto){
  Object.defineProperty(proto, 'last', {
    get: function(){ return this[this.length - 1] }
  })
})

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
NodeList.prototype.at = HTMLCollection.prototype.at = HTMLFormControlsCollection.prototype.at = Array.prototype.at
NodeList.prototype.map = HTMLCollection.prototype.map = HTMLFormControlsCollection.prototype.map = Array.prototype.map

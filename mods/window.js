module.exports = function(window) {
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
      try {
        Promise.resolve(callback.call(this, arg))
        .then(() => { status = false })
        .catch(e => { console.debug(e) })
      } catch(e) { console.debug(e) }
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
}

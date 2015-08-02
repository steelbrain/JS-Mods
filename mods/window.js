module.exports = function(window){
  window.ajax = function(Url, Method, Contents) {
    let XHR = new XMLHttpRequest()
    let Deferred = Promise.defer()
    XHR.open(Method, Url, true)
    XHR.withCredentials = true
    XHR.addEventListener('load', () => {
      if (XHR.status >= 200 && XHR.status < 400) {
        Deferred.resolve(XHR.responseText)
      } else {
        Deferred.reject({code: XHR.status, response: XHR.responseText})
      }
    })
    XHR.addEventListener('error', Deferred.reject)
    XHR.send(Contents)
    return Deferred.promise
  }
  window.ajax.serialize = function(values){
    let ToReturn = []
    for(var i in values){
      ToReturn.push(i + '=' + encodeURIComponent(values[i]))
    }
    return ToReturn.join('&')
  }
  window.debounce = function(callback, delay){
    let timeout = null
    let toReturn = function(arg){
      clearTimeout(timeout)
      timeout = setTimeout(() => callback.call(this, arg), delay)
    }
    toReturn.prototype = callback.prototype
    return toReturn
  }
  window.lock = function(callback){
    let status = false
    return function(arg){
      if(status) return status
      status = true
      try {
        Promise.resolve(callback.call(this, arg))
        .then(() => {status = false})
        .catch(e => {console.debug(e)})
      } catch(e){ console.debug(e) }
    }
  }
  window.memoize = function(callback){
    let cache = {}
    let toReturn = function(arg){
      return cache[arg] ? cache[arg] : cache[arg] = callback.call(this, arg)
    }
    toReturn.prototype = callback.prototype
    return toReturn()
  }
  window.extend = function(toReturn = {}) {
    for(var i = 1; i <= arguments.length; ++i){
      var argument = arguments[i];
      for (var prop in argument) {
        if (Object.prototype.hasOwnProperty.call(argument, prop)) {
          toReturn[prop] = argument[prop]
        }
      }
    }
    return toReturn;
  }
  window.setImmediate = function(func){
    setTimeout(func, 0)
  }
  window.reload = function(timeout = 2000){
    setTimeout(() => location.reload(), timeout)
  }
}

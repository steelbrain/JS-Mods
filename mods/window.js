module.exports = function(window){
  window.Ajax = function(Url, Method, Contents){
    let XHR = new XMLHttpRequest()
    let Deferred = Promise.defer()
    XHR.open(Method, Url, true)
    XHR.withCredentials = true
    XHR.addEventListener('load', () => {
      if (XHR.status >= 200 && XHR.status < 400) {
        Deferred.resolve(XHR.responseText,XHR)
      } else {
        Deferred.reject(new Error("HTTP Error"))
      }
    })
    XHR.addEventListener('error', Deferred.reject)
    XHR.send(Contents)
    return Deferred.promise
  }
  window.Ajax.Serialize = function(values){
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
      return Promise.resolve(callback.call(this, arg)).then(() => {status = false})
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
  window.setImmediate = function(func){
    setTimeout(func, 0)
  }
  window.reload = function(timeout = 2000){
    setTimeout(() => location.reload(), timeout)
  }
}
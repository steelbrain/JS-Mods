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
}
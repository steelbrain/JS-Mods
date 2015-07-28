module.exports = function(){
  Array.prototype.last = function(){
    return this[this.length - 1]
  }
  NodeList.prototype.forEach = HTMLCollection.prototype.forEach = HTMLFormControlsCollection.prototype.forEach = Array.prototype.forEach
  NodeList.prototype.indexOf = HTMLCollection.prototype.indexOf = HTMLFormControlsCollection.prototype.indexOf = Array.prototype.indexOf
  NodeList.prototype.last = HTMLCollection.prototype.last = HTMLFormControlsCollection.prototype.last = Array.prototype.last
  Promise.prototype.finally = function(callback){
    return this.then(result => callback(null, result), error => callback(error))
  }
  Location.prototype.getParam = function(key){
    let value = new RegExp('[?&]'+key+'=[^&]+').exec(this.search)
    return !!value ? decodeURIComponent(value.toString().replace(/^[^=]+./,'')) : false
  }
}
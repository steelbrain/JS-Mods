module.exports = function(Prototype){
  Prototype.on = function(event, callback){
    this.addEventListener(event, callback)
    return new EventKit.Disposable(() => this.removeEventListener(event, callback))
  }
  Prototype.once = function(name, callback){
    var realCallback = (e) => this.removeEventListener(name, realCallback) || callback.call(this, e)
    this.on(name, realCallback)
    return new EventKit.Disposable(() => this.removeEventListener(event, realCallback))
  }
}
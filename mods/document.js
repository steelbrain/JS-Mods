module.exports = function(Prototype){
  Prototype.byId = Prototype.getElementById
  Prototype.byClass = Prototype.getElementsByClassName
  Prototype.byTag = Prototype.getElementsByTagName
  Prototype.find = Prototype.querySelector
  Prototype.findAll = Prototype.querySelectorAll
  Prototype.Ready = function(Callback){
    this.readyState === "complete" || this.readyState === 'interactive' ? Callback() : this.on('DOMContentLoaded', Callback)
  }
  Prototype.onScrollToBottom = function(Callback){
    return this.on('scroll', window.lock(e => {
      if(this.body.scrollHeight <=
        this.body.scrollTop +
        window.innerHeight + 1000)
        return Callback(e)
    }))
  }
}

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
    let InProgress = false
    let Watcher = e => {
      if (InProgress) return
      if (this.body.scrollHeight <=
        this.body.scrollTop +
        window.innerHeight + 1000) {
        InProgress = true
        ;(new Promise(resolve => resolve(Callback(e)))).then(() => InProgress = false)
      }
    }
    return this.on('scroll', Watcher)
  }
}
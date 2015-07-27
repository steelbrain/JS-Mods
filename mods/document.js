module.exports = function(Prototype){
  Prototype.byId = Prototype.getElementById
  Prototype.byClass = Prototype.getElementsByClassName
  Prototype.byTag = Prototype.getElementsByTagName
  Prototype.find = Prototype.querySelector
  Prototype.findAll = Prototype.querySelectorAll
  Prototype.Ready = function(Callback){
    this.readyState === "complete" || this.readyState === 'interactive' ? Callback() : this.on('DOMContentLoaded', Callback)
  }
}
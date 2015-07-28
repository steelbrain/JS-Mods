"use strict"
module.exports = function(Prototype){
  Prototype.byClass = Prototype.getElementsByClassName
  Prototype.byTag = Prototype.getElementsByTagName
  Prototype.find = Prototype.querySelector
  Prototype.findAll = Prototype.querySelectorAll
  Prototype.hide = function(){
    this.setAttribute('hidden', true)
    return this
  }
  Prototype.show = function(){
    this.removeAttribute('hidden')
    return this
  }
  Prototype.toggleVisibility = function(){
    if(this.hasAttribute('hidden')){
      this.show()
    } else {
      this.hide()
    }
  }
  Prototype.setAttr = function(key, value){
    this.setAttribute(key, value)
    return this
  }
  Prototype.removeAttr = function(key){
    this.removeAttribute(key)
    return this
  }
  Prototype.append = function(item){
    this.appendChild(item)
    return this
  }
  Prototype.appendTo = function(item){
    item.appendChild(this)
    return this
  }
  Prototype.prepend = function(item){
    this.insertBefore(item, this.firstChild)
    return this
  }
  Prototype.prependTo = function(item){
    item.prepend(this)
    return this
  }
  Prototype.insertAfter = function(item){
    item.parentNode.insertBefore(this, item.nextSibling);
    return this
  }
  Prototype.addClass = function(name){
    this.classList.add(name)
    return this
  }
  Prototype.removeClass = function(name){
    this.classList.remove(name)
    return this
  }
  Prototype.hasClass = function(name){
    return this.classList.contains(name)
  }
  Prototype.toggleClass = function(name){
    this.classList.toggle(name)
    return this
  }
  Prototype.setText = function(text){
    this.textContent = text
    return this
  }
  Prototype.setHTML = function(html){
    this.innerHTML = html
    return this
  }
  Prototype.isInViewPort = function(){
    var rect = this.getBoundingClientRect()
    return rect.top >= 0 && rect.bottom <= window.innerHeight
  }
  Prototype.onScrollIntoView = function(callback){
    setImmediate(() => {
      if(this.isInViewPort()) return callback.call(this)
      var frameRequest = null
      var onScroll = () => {
        cancelAnimationFrame(frameRequest)
        frameRequest = requestAnimationFrame(() => {
          if(this.isInViewPort()){
            document.off('scroll', onScroll)
            callback.call(this)
          }
        })
      }
      document.on('scroll', onScroll)
    })
  }
  Prototype.trigger = function(name, detail){
    let event
    if(!data){
      event = document.createEvent('HTMLEvents')
      event.initEvent(name, true, false)
    } else {
      if (window.CustomEvent) {
        event = new CustomEvent(name, {detail})
      } else {
        event = document.createEvent('CustomEvent')
        event.initCustomEvent(name, true, true, detail)
      }
    }
    this.dispatchEvent(event)
    return event
  }
}
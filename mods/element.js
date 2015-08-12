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
  // Note: This behavior is not compliant with insertBefore one
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
  Prototype.offset = function(){
    var rect = this.getBoundingClientRect()
    return {top: rect.top, left: rect.left}
  }
  Prototype.onScrollIntoView = function(callback){
    setImmediate(() => {
      if(this.isInViewPort()) return callback.call(this)
      var frameRequest = null
      var Disposable = document.on('scroll', () => {
        cancelAnimationFrame(frameRequest)
        frameRequest = requestAnimationFrame(() => {
          if(this.isInViewPort()){
            Disposable.dispose()
            callback.call(this)
          }
        })
      })
    })
  }
  Prototype.trigger = function(name, detail){
    let event
    if(!detail){
      event = document.createEvent('HTMLEvents')
      event.initEvent(name, true, false)
    } else {
      event = new CustomEvent(name, {detail})
    }
    this.dispatchEvent(event)
    return event
  }
  Prototype.serialize = function() {
    return ajax.serialize(this.serializeAssoc())
  }
  Prototype.serializeAssoc = function() {
    const ToReturn = {}
    const LFFix = /\r?\n/g
    const SpaceFix = /%20/g
    this.findAll('[name]').forEach(n => {
      if (!n.name || ((n.type === 'checkbox' || n.type === 'radio') && !n.checked)) {
        return
      }
      ToReturn[n.name] = n.value.replace(LFFix, "\n").replace(SpaceFix, '+')
    })
    return ToReturn
  }
}

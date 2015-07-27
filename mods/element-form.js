module.exports = function(Prototype){
  Prototype.serialize = function(){
    return Ajax.Serialize(this.serializeAssoc())
  }
  Prototype.serializeAssoc = function(){
    let ToReturn = {}
    let LFFix = /\r?\n/g
    let SpaceFix = /%20/g
    for(var i = 0; i < this.elements.length; ++i){
      var n = this.elements[i]
      if (!n.name || ((n.type === 'checkbox' || n.type === 'radio') && !n.checked)){
        continue
      }
      ToReturn[n.name] = n.value.replace(LFFix, "\n").replace(SpaceFix, '+')
    }
    return ToReturn
  }
}
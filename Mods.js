"use strict";


NodeList.prototype.forEach = HTMLFormControlsCollection.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.indexOf = HTMLFormControlsCollection.prototype.indexOf = Array.prototype.indexOf;

Element.prototype.find = Document.prototype.find = Document.prototype.querySelector;
Element.prototype.findAll = Document.prototype.findAll = Document.prototype.querySelectorAll;
Node.prototype.on = Node.prototype.addEventListener;
Node.prototype.off = Node.prototype.removeEventListener;

Function.prototype.memoize = function(){
  var Me = this;
  this.cache = {};
  return function(arg){
    return Me.cache[arg] ? Me.cache[arg] : Me.cache[arg] = Me(arg);
  };
};

Node.prototype.closest = function(Match){
  if(this.match(Match)) return this;
  var el = this;
  while(el = el.parentNode){
    if(el.match(Match)) return el;
  }
  return null;
};

HTMLFormElement.prototype.serialize = function(){
  var ToReturn = [];
  var Vals = this.serializeAssoc();
  for(var i in Vals){
    ToReturn.push(i + '=' + Vals[i]);
  }
  return ToReturn.join('&');
};
HTMLFormElement.prototype.serializeAssoc = function(){
  var ToReturn = {};
  var LFFix = /\r?\n/g;
  var SpaceFix = /%20/g;
  for(var i = 0; i < this.elements.length; ++i){
    var n = this.elements[i];
    if (!n.name || ((n.type === 'checkbox' || n.type === 'radio') && !n.checked)){
      continue ;
    }
    ToReturn[n.name] = n.value.replace(LFFix, "\n").replace(SpaceFix, '+');
  }
  return ToReturn;
};
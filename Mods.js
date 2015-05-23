"use strict";

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
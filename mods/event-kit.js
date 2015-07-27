module.exports = function(window){
  let EventKit = require('event-kit')
  window.Emitter = EventKit.Emitter
  window.Disposable = EventKit.Disposable
  window.CompositeDisposable = EventKit.CompositeDisposable
}
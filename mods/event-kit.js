module.exports = function(window){
  let EventKit = require('zm-event-kit/src/EventKit.js')
  window.Emitter = EventKit.Emitter
  window.Disposable = EventKit.Disposable
  window.CompositeDisposable = EventKit.CompositeDisposable
}
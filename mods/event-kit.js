module.exports = function(window){
  let EventKit = require('zm-event-kit')
  window.Emitter = EventKit.Emitter
  window.Disposable = EventKit.Disposable
  window.CompositeDisposable = EventKit.CompositeDisposable
}

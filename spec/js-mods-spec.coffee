describe 'JS-Mods', ->
  $ = require('../dist/mods.transpiled')
  el = null
  $el = null

  beforeEach ->
    el = document.createElement('div')
    $el = $(el)

  it 're-uses the same objects for same elements', ->
    expect($el).toEqual($(el))
  it 'is awesome', ->
    expect(true).toBe(true)

  describe '::ready', ->
    it 'is invoked immediately if window is loaded', ->
      invoked = false
      $(document).ready( ->
        invoked = true
      )
      expect(invoked).toBe(true)
  describe 'events', ->
    it 'works via disposables', ->
      timesInvoked = 0
      disposable = $el.on 'custom', ->
        timesInvoked++
      $el.trigger('custom')
      $el.trigger('custom')
      $el.trigger('custom')
      disposable.dispose()
      $el.trigger('custom')
      $el.trigger('custom')
      expect(timesInvoked).toBe(3)
    it 'supports once', ->
      timesInvoked = 0
      disposable = $el.once 'custom', ->
        timesInvoked++
      $el.trigger('custom')
      $el.trigger('custom')
      expect(timesInvoked).toBe(1)
    it 'supports disposable once', ->
      timesInvoked = 0
      disposable = $el.once 'custom', ->
        timesInvoked++
      disposable.dispose()
      $el.trigger('custom')
      $el.trigger('custom')
      expect(timesInvoked).toBe(0)
  describe 'native proxies', ->
    it 'gets id', ->
      el.id = 'wow'
      expect($el.id).toBe(el.id)
    it 'sets id', ->
      $el.id = 'wow'
      expect(el.id).toBe($el.id)
    it 'gets className', ->
      el.className = 'wow'
      expect($el.className).toBe(el.className)
    it 'sets className', ->
      $el.className = 'wow'
      expect(el.className).toBe($el.className)
    it 'sets textContent', ->
      $el.textContent = 'Hey'
      expect(el.textContent).toBe($el.textContent)
    it 'gets textContent', ->
      el.textContent = 'Hey'
      expect($el.textContent).toBe(el.textContent)
    it 'sets innerHTML', ->
      $el.innerHTML = 'Hey'
      expect(el.innerHTML).toBe($el.innerHTML)
    it 'gets innerHTML', ->
      el.innerHTML = 'Hey'
      expect($el.innerHTML).toBe(el.innerHTML)
    it 'gets classList', ->
      expect($el.classList).toBe(el.classList)
    it 'gets style', ->
      expect($el.style).toBe(el.style)
    it 'gets dataset', ->
      expect($el.dataset).toBe(el.dataset)
    it 'gets title', ->
      el.title = 'Hey'
      expect($el.title).toBe(el.title)
    it 'sets title', ->
      $el.title = 'Hey'
      expect(el.title).toBe($el.title)
  describe '::find', ->
    it 'returns a dollar object when something is found', ->
      $el.append(document.createElement('a'))
      expect($el.find('a').constructor).toBe($el.constructor)
    it 'returns null when its not found', ->
      expect($el.find('asdasd')).toBeNull()
  describe '::findAll', ->
    it 'works returns a node list', ->
      $el.append(document.createElement('a'))
      found = $el.findAll('a')
      expect(found.length).toBe(1)
      expect(found instanceof NodeList).toBe(true)
  describe '::hide', ->
    it 'works', ->
      $el.hide()
      expect($el.hasAttr('hidden')).toBe(true)
  describe '::show', ->
    it 'works', ->
      $el.hide()
      expect($el.hasAttr('hidden')).toBe(true)
      $el.show()
      expect($el.hasAttr('hidden')).toBe(false)
  describe '::toggleVisibility', ->
    it 'works', ->
      $el.toggleVisibility()
      expect($el.hasAttr('hidden')).toBe(true)
      $el.toggleVisibility()
      expect($el.hasAttr('hidden')).toBe(false)
      $el.toggleVisibility()
      expect($el.hasAttr('hidden')).toBe(true)
  describe '::getAttr', ->
    it 'works', ->
      el.setAttribute('test', 'wow')
      expect($el.getAttr('test')).toBe('wow')
  describe '::hasAttr', ->
    it 'works', ->
      expect($el.hasAttr('test')).toBe(false)
      el.setAttribute('test', 'wow')
      expect($el.hasAttr('test')).toBe(true)
  describe '::setAttr', ->
    it 'works', ->
      $el.setAttr('hey', 'there')
      expect(el.getAttribute('hey')).toBe('there')
  describe '::removeAttr', ->
    it 'works', ->
      $el.setAttr('key', 'value')
      expect($el.hasAttr('key')).toBe(true)
      $el.removeAttr('key')
      expect($el.hasAttr('key')).toBe(false)
  describe '::append', ->
    it 'appends an element', ->
      newEl = document.createElement('div')
      $el.append(newEl)
      expect(el.childNodes.length).toBe(1)
      $el.append($(newEl))
      expect(el.childNodes.length).toBe(1)
  describe '::appendTo', ->
    it 'appends to an element', ->
      newEl = document.createElement('div')
      $newEl = $(newEl)
      expect(el.childNodes.length).toBe(0)
      $newEl.appendTo(el)
      expect(el.childNodes.length).toBe(1)
      $newEl.appendTo($el)
      expect(el.childNodes.length).toBe(1)
  describe '::prepend', ->
    it 'prepends an element', ->
      newEl = document.createElement('div')
      $el.prepend(newEl)
      expect(el.childNodes.length).toBe(1)
      $el.prepend($(newEl))
      expect(el.childNodes.length).toBe(1)
  describe '::prependTo', ->
    it 'prepends to an element', ->
      newEl = document.createElement('div')
      $newEl = $(newEl)
      expect(el.childNodes.length).toBe(0)
      $newEl.prependTo(el)
      expect(el.childNodes.length).toBe(1)
      $newEl.prependTo($el)
      expect(el.childNodes.length).toBe(1)

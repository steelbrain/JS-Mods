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
    it 'gets childNodes', ->
      expect($el.childNodes).toBe(el.childNodes)
    it 'gets children', ->
      expect($el.children).toBe(el.children)
    it 'gets firstElementChild', ->
      expect($el.firstElementChild).toBe(el.firstElementChild)
    it 'gets lastElementChild', ->
      expect($el.lastElementChild).toBe(el.lastElementChild)
    it 'gets firstChild', ->
      expect($el.firstChild).toBe(el.firstChild)
    it 'gets lastChild', ->
      expect($el.lastChild).toBe(el.lastChild)
  describe '::find', ->
    it 'returns a dollar object when something is found', ->
      $el.append(document.createElement('a'))
      expect($el.find('a').constructor).toBe($el.constructor)
    it 'returns null when its not found', ->
      expect($el.find('asdasd')).toBeNull()
  describe '::findAll', ->
    it 'works returns an array of Dollar Objects', ->
      $el.append(document.createElement('a'))
      found = $el.findAll('a')
      expect(found.length).toBe(1)
      expect(found instanceof Array).toBe(true)
      expect(found[0].constructor.name).toBe('Dollar')
  describe '::hide', ->
    it 'works', ->
      $el.hide()
      expect($el.hasAttribute('hidden')).toBe(true)
  describe '::show', ->
    it 'works', ->
      $el.hide()
      expect($el.hasAttribute('hidden')).toBe(true)
      $el.show()
      expect($el.hasAttribute('hidden')).toBe(false)
  describe '::toggleVisibility', ->
    it 'works', ->
      $el.toggleVisibility()
      expect($el.hasAttribute('hidden')).toBe(true)
      $el.toggleVisibility()
      expect($el.hasAttribute('hidden')).toBe(false)
      $el.toggleVisibility()
      expect($el.hasAttribute('hidden')).toBe(true)
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
  describe '::insertAfter', ->
    it 'is inserted after the referencing element', ->
      newEl = document.createElement('div')
      lastEl = document.createElement('div')
      $el.append(newEl)
      $(lastEl).insertAfter(newEl)
      expect($el.lastElementChild).toBe(lastEl)
  describe '::addClass', ->
    it 'works', ->
      $el.addClass('hey')
      expect(el.classList.contains('hey')).toBe(true)
  describe '::removeClass', ->
    it 'works', ->
      $el.addClass('hey')
      expect(el.classList.contains('hey')).toBe(true)
      $el.removeClass('hey')
      expect(el.classList.contains('hey')).toBe(false)
  describe '::hasClass', ->
    it 'works', ->
      $el.addClass('hey')
      expect($el.hasClass('hey')).toBe(true)
      $el.removeClass('hey')
      expect($el.hasClass('hey')).toBe(false)
  describe '::toggleClass', ->
    it 'works', ->
      expect($el.hasClass('hey')).toBe(false)
      $el.toggleClass('hey')
      expect($el.hasClass('hey')).toBe(true)
      $el.toggleClass('hey')
      expect($el.hasClass('hey')).toBe(false)
  describe '::setText', ->
    it 'works', ->
      expect($el.textContent).toBe('')
      $el.setText('Hey There')
      expect($el.textContent).toBe('Hey There')
  describe '::setHTML', ->
    it 'works', ->
      expect($el.innerHTML).toBe('')
      $el.setHTML('&nbsp;')
      expect($el.innerHTML).toBe('&nbsp;')
  describe '::isInViewPort', ->
    # Ignore for now
    expect(true).toBe(true)
  describe '::offset', ->
    # Ignore for now
    expect(true).toBe(true)
  describe '::closest', ->
    it 'returns the closest element', ->
      newEl = document.createElement('div')
      $el.append(newEl)
      expect($(newEl).closest('div')).toBe($(newEl))
      anotherNewEl = document.createElement('a')
      $el.append(anotherNewEl)
      expect($(anotherNewEl).closest('div')).toBe($el)
  describe '::trigger', ->
    it 'works with native events', ->
      triggered = false
      $el.on 'click', -> triggered = true
      $el.trigger('click')
      expect(triggered).toBe(true)
    it 'works with custom events', ->
      triggered = false
      $el.on 'wow', -> triggered = true
      $el.trigger('wow')
      expect(triggered).toBe(true)
    it 'passes the data', ->
      triggered = false
      $el.on 'click', (e) ->
        triggered = true
        expect(e.detail.a).toBe(1)
        expect(e.detail.b).toBe(2)
      $el.trigger('click', {a : 1, b : 2})
      expect(triggered).toBe(true)
  describe '::onScrollToBottom', ->
    it 'works', ->
      # Ignore for now
      expect(true).toBe(true)
  describe '::onScrollIntoView', ->
    it 'works', ->
      # Ignore for now
      expect(true).toBe(true)
  describe '::matches', ->
    it 'works', ->
      expect($el.matches('.a')).toBe(false)
      $el.addClass('a')
      expect($el.matches('.a')).toBe(true)
  describe '::focus', ->
    it 'focuses that element', ->
      newEl = document.createElement('input')
      $newEl = $(newEl)
      document.body.appendChild(newEl)
      $newEl.focus()
      expect($newEl.matches(':focus')).toBe(true)
      $newEl.remove()
  describe '::blur', ->
    it 'works', ->
      # Ignore for now
      expect(true).toBe(true)
  describe '::serializeAssoc', ->
    it 'works', ->
      input = document.createElement('input')
      input.type = 'text'
      input.name = 'input'
      input.value = 'input'
      $el.append(input)
      expect($el.serializeAssoc().input).toBe('input')
  describe '::serialize', ->
    it 'works', ->
      input = document.createElement('input')
      input.type = 'text'
      input.name = 'input'
      input.value = 'input'
      $el.append(input)
      expect($el.serialize()).toBe('input=input')
  describe '::remove and ::hasChild', ->
    it 'works', ->
      input = document.createElement('input')
      expect($el.hasChild(input)).toBe(false)
      $el.append(input)
      expect($el.hasChild(input)).toBe(true)
      $(input).remove()
      expect($el.hasChild(input)).toBe(false)

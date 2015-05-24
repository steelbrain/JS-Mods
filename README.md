JS-Mods
=======
JS-Mods is my personal collection of JS protoype mods. They make the DOM and other stuff rock :metal:

#### Usage
Imagine jQuery, but without jQuery!
```js
var container = document.find('.container');
var form = container.find('#MyForm');
var button = form.find('#button');
button.on('click', function(e){
  e.preventDefault();
  console.log(form.serialize())
});
```

#### License
This project is licensed under the terms of MIT License.
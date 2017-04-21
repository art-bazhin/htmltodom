(function() {
  'use strict'

  var input = document.getElementById('input');
  var output = document.getElementById('code');
  var button = document.getElementById('button');
  var checkbox = document.getElementById('checkbox');

  var parser = document.createElement('div');

  var string;
  var declarations;
  var appendings;

  button.onclick = generateCode;

  function generateCode() {
    string = input.value;
    parser.innerHTML = string;
    declarations = '';
    appendings = '';

    output.classList.remove('code--error');

    if (checkbox.checked) minifyHTML();

    try {
      processHTML();
      printToOutput(declarations + appendings);
      resizeOutput();
    } catch (error) {
      processError(error);
      resizeOutput();
    }
  }

  function minifyHTML() {
    string = parser.innerHTML;
    string = string.replace(/\n|\r/g, ' ');
    string = string.replace(/\t/g, ' ');
    string = string.replace(/\s+/g, ' ');
    string = string.replace(/>\s+/g, '>');
    string = string.replace(/\s+<\//g, '</');
    parser.innerHTML = string;
  }

  function processHTML() {
    for (var i = 0; i < parser.childNodes.length; i ++) {
      processNode(parser.childNodes[i]);
    }
  }

  function processNode(node) {
    var parent = node.parentNode.getAttribute('jsvar');

    if (node.nodeType == 1) {
      if (!node.getAttribute('jsvar')) throw 'ERROR: ' + node.tagName + ' "jsvar" attribute is not set!';

      var varName = node.getAttribute('jsvar');
      var attributes = node.attributes;

      declarations += 'var ' + varName + ' = document.createElement(\'' + node.tagName.toLowerCase() + '\');\n';
      
      for (var i = 0; i < attributes.length; i++) {
        processNodeAttribute(attributes[i], varName);
      }

      declarations += '\n';

      if (parent) {
        appendings += parent + '.appendChild(' + varName + ');\n';
      }
    } else if (node.nodeType == 3) {
      if (parent) {
        var text = JSON.stringify(node.wholeText);
        text = text.substr(1, text.length - 2);

        appendings += parent + '.appendChild(document.createTextNode(\'' + text + '\'));\n';
      }
    }

    for (var i = 0; i < node.childNodes.length; i ++) {
      processNode(node.childNodes[i]);
    }
  }

  function processNodeAttribute(attribute, varName) {
    if (attribute.name == 'jsvar') return;
    declarations += varName + '.setAttribute(\'' + attribute.name + '\', \'' + attribute.value + '\');\n';
  }

  function processError(error) {
    printToOutput(error);
    output.classList.add('code--error');
  }

  function printToOutput(string) {
    output.childNodes[0].data = string;
  }

  function resizeOutput() {
    output.style.height = '';
    output.style.height = output.scrollHeight + 5 + 'px';
  }

}());
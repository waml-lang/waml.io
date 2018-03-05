$('#validation').html('Loading...')

var SCHEMA_URL = 'https://raw.githubusercontent.com/waml-lang/waml/master/schemas/schema.json';
var EXAMPLES = {
  google: [
    'waml: 0.1.0',
    '',
    'steps:',
    '    - click: a.link'
  ].join('\n'),
  hn: [
    'test'
  ].join('\n')
}
var ajv = new Ajv();

require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], function() {
  window.editor = monaco.editor.create(document.getElementById('container'), {
    value: EXAMPLES['google'],
    language: 'yaml'
  });
  window.editor.getModel().updateOptions({ tabSize: 4 })
  $('#validation').html('Editor loaded');
});

console.log('Loading JSON Schema from ' + SCHEMA_URL);
$.getJSON(SCHEMA_URL, function(schema) {
  $('#validation').html('JSON Schema loaded');
  $('button').click(function() {
    console.log('Validating JSON');
    var yaml = window.editor.getValue();
    var json = YAML.parse(yaml);
    var valid = ajv.validate(schema, json);

    $("#validation").fadeOut(100);
    if (!valid) {
      var errorMessages = [];
      ajv.errors.forEach(function(err) {
        errorMessages.push(err.dataPath + " " + err.message);
      });
      errorMessages = _.uniq(errorMessages);
      var errorHTML = "☹️ WAML is invalid:";
      errorMessages.forEach(function(message) {
        errorHTML = errorHTML + "<li>" + message + "</li>";
      })
      $('#validation').html(errorHTML);
    } else {
      $('#validation').html('😀 WAML document is valid.');
    };
    $("#validation").fadeIn(100);
  });
});

$('select').on('change', function() {
  window.editor.setValue(EXAMPLES[this.value])
})

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
});

$.getJSON(SCHEMA_URL, function(schema) {
  $('button').click(function() {
    var yaml = window.editor.getValue();
    var json = YAML.parse(yaml);
    var valid = ajv.validate(schema, json);

    $("#validation").fadeOut(100);
    if (!valid) {
      console.log(ajv.errors);
      $('#validation').html(JSON.stringify(ajv.errors));
    } else {
      $('#validation').html('✓ WAML document is valid.');
    };
    $("#validation").fadeIn(100);
  });
});

$('select').on('change', function() {
  window.editor.setValue(EXAMPLES[this.value])
})

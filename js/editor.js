$('#validation').html('Loading...')

var SCHEMA_URL = 'https://raw.githubusercontent.com/waml-lang/waml/master/schemas/schema.json';
var EXAMPLES = {
  google: [
    'waml: 0.1.0',
    '',
    'steps:',
    '    - visit: https://google.com',
    '    - fill:',
    '        selector: input#search',
    '        value: Ugandan knuckles',
    '    - click: a#search',
    '    - wait:',
    '    - snap:',
    '        filename: test'
  ].join('\n'),
  hn: [
    'waml: 0.1.0',
    '',
    'info:',
    '    description: Scrapes the link titles from the Hacker News frontpage',
    '',
    'steps:',
    '    - visit: https://news.ycombinator.com/news',
    '    - scrape:',
    '        hackerNewsTitles: select a.storylink {0,} | get text'
  ].join('\n'),
  youtube: [
    'waml: 0.1.0',
    '',
    'info:',
    "    description: Looks for Fleetwood Mac's Dreams video on youtube.com and clicks on the third video. Waits for 5 seconds for the video to load.",
    '',
    'steps:',
    '    - visit: https://youtube.com',
    '    - fill:',
    "        selector: '#search'",
    "        value: innerText",
    "    - click: button#search-icon-legacy",
    "    - wait: ytd-thumbnail.ytd-video-renderer",
    "    - snap: foo",
    "        filename: foo"
    "    - click:",
    "        selector: ytd-thumbnail.ytd-video-renderer",
    "        index: 2 # click 3rd video from the list",
    "    - wait: .html5-video-container",
    "    - wait: 5000",
    "    - snap:",
    "        filename: bar"
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

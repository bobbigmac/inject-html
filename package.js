var fs = Npm.require('fs');
var path = Npm.require('path');

Package.describe({
  "summary": "A way to provide default HTML to the client",
  "version": "0.1.0",
  "git": "https://github.com/bobbigmac/inject-html",
  "name": "bobbigmac:inject-html"
});

Package.onUse(function(api) {
  configure(api);
  //TODO: This needs to be used in html-render: api.use("meteorhacks:ssr@2.0.0");
  api.export('InjectHtml', ['client', 'server']);
});

Package.onTest(function(api) {
  configure(api);
  api.use('tinytest', ['client', 'server']);
  api.use('http', 'server');
  api.use('meteorhacks:picker@1.0.1', 'server');

  api.addFiles([
    'tests/utils.js'
  ], ['client', 'server']);

  api.addFiles([
    'tests/client.js'
  ], 'client');

  api.addFiles([
    'tests/integration.js',
    'tests/init.js'
  ], 'server');
});

function configure (api) {
  api.versionsFrom('METEOR@0.9.3');

  api.use(['underscore'], ['server', 'client']);

  api.addFiles([
    'lib/namespace.js',
    'lib/utils.js',
  ], ['client', 'server']);

  api.addFiles([
    'lib/server.js'
  ], 'server');

  api.addFiles([
    'lib/client.js'
  ], 'client');
}

Package.describe({
  name: "<%= fullname %>",
  summary: "/* Fill me in! */",
  // uncomment before publishing // version: "0.1.0",
  git: "https://github.com/percolatestudio/meteor-<%= name %>.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0.2');

  api.use([], ['client', 'server']);

  api.addFiles(['<%= name %>-common.js']);
  api.addFiles(['<%= name %>-client.js'], 'client');
  api.addFiles(['<%= name %>-server.js'], 'server');

  api.export('<%= upname %>', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('<%= fullname %>');
  api.addFiles('<%= name %>-tests.js');
});
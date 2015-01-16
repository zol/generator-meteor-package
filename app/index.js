'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var _s = require('underscore.string');
var path = require('path');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: {
    askForDetails: function () {
      var done = this.async();

      var prompts = [{
        name: 'packagename',
        message: 'What\'s the name of your package (use - for multi word, i.e \'foo-bar\')?',
        // for some reason -'s in appname become spaces
        default: this.config.get('name') || this.appname.replace(' ', '-')
      }, {
        name: 'username',
        message: 'What\'s the name of your user?',
        default: this.config.get('username') || 'percolate'
      }];

      this.prompt(prompts, function (props) {
        this.appname = props.packagename;
        this.username = props.username;

        done();
      }.bind(this));
    }
  },

  configuring: {
    setup: function() {
      this.config.set({
        name: this.appname,
        username: this.username,
        fullname: this.username + ':' + this.appname,
        upname: _s.capitalize(_s.camelize(this.appname))
      })
    }
  },

  writing: {
    packagefiles: function () {
      var self = this;

      var ctx = this.config.getAll();

      var files = [
        ['client.js', ctx.name + '-client.js'],
        ['common.js', ctx.name + '-common.js'],
        ['dotgitignore', '.gitignore'],
        ['example-packages', 'example/.meteor/packages'],
        'package.js',
        'README.md',
        ['server.js', ctx.name + '-server.js'],
        ['tests.js', ctx.name + '-tests.js']
      ]

      // This is somewhat dodgy but yeoman kinda sucks. Ideally we'd use
      // meteor to create the example app but then we can't use a template
      // to write .meteor/packages. Note also that examples/packages/.empty
      // is required as the .directory command ignores empty dirs.
      self.directory(
        self.templatePath('example'),
        self.destinationPath('example')
      ).on('end', function() {
        fs.symlink('../..',
            self.destinationPath('example/packages/' + ctx.fullname),
            _.identity);
      });

      // copy and place all the templates
      _.each(files, function(file) {
        var src, dest;

        if (_.isArray(file)) {
          src = file[0];
          dest = file[1];
        } else {
          src = dest = file;
        }
        
        self.fs.copyTpl(self.templatePath(src), self.destinationPath(dest), ctx);
      });
    },
    
    // broken, just here for reference
    //function() {
    //   var self = this;
    //   var child = self.spawnCommand('meteor', ['create', 'example']);
    //
    //   child.on('error', function() {
    //     console.log("Error spawning 'meteor', are you sure it's installed?");
    //   });
    //
    //   child.on('exit', function(code, signal) {
    //     // This doesnt work as the in-mem filesystem is already closed
    //     // or something
    //     self.fs.copyTpl(
    //       self.templatePath('example-packages'),
    //       self.destinationPath('example/.meteor/packages'),
    //       { name: this.fullname }
    //     );
    //     // self.fs.commit();
    //   });
    // }
  }
});

var http = Npm.require('http');

//var templateText = Assets.getText('lib/inject.html');
//var injectDataTemplate = _.template(templateText);

SSR.compileTemplate('timeText', 'Now time is: {{time}}');
SSR.compileTemplate('exampleText', '<div class="container">Hello {{name}}, <br />{{> timeText}}</div>');

Template.timeText.helpers({
  time: function() {
    return new Date().toString();
  }
});

// custom API
http.OutgoingMessage.prototype.pushData = function pushData(key, value) {
  if(!this._injectPayload) {
    this._injectPayload = {};
  }

  this._injectPayload[key] = value;
};

http.OutgoingMessage.prototype.getData = function getData(key) {
  if(this._injectPayload) {
    return _.clone(this._injectPayload[key]);
  } else {
    return null;
  }
};

// overrides
var originalWrite = http.OutgoingMessage.prototype.write;
http.OutgoingMessage.prototype.write = function(chunk, encoding) {
  this._injectPayload = 'My body text';
  var condition =
    this._injectPayload && !this._injected &&
    encoding === undefined &&
    /<!DOCTYPE html>/.test(chunk);

  if(condition) {
    // if cors headers included if may cause some security holes
    // so we simply turn off injecting if we detect an cors header
    // read more: http://goo.gl/eGwb4e
    if(this._headers['access-control-allow-origin']) {
      var warnMessage =
        'warn: injecting data turned off due to CORS headers. ' +
        'read more: http://goo.gl/eGwb4e';

      console.warn(warnMessage);
      originalWrite.call(this, chunk, encoding);
      return;
    }

    // inject data
    //var data = InjectData._encode(this._injectPayload);
    //var injectHtml = this._injectPayload;//injectDataTemplate({data: data});
    var injectHtml = SSR.render("exampleText", { name: "Bob" });

    // if this is a buffer, convert it to string
    chunk = chunk.toString();
    chunk = chunk.replace('</body>', injectHtml + '\n</body>');
    //console.log('chunk', chunk);

    this._injected = true;
  }

  originalWrite.call(this, chunk, encoding);
};
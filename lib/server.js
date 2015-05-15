var http = Npm.require('http');

//SSR.compileTemplate('timeText', 'Now time is: {{time}}');
//SSR.compileTemplate('exampleText', '<div class="container preload">Hello {{name}}, <br />{{> timeText}}</div>');

// Template.timeText.helpers({
//   time: function() {
//     return new Date().toString();
//   }
// });
    //var injectHtml = injectDataTemplate({ data: data });
    //var injectHtml = SSR.render("exampleText", { name: "Bob" });

// custom API
http.OutgoingMessage.prototype.pushContent = function pushContent(key, value) {
  if(!this._injectPayload) {
    this._injectPayload = {};
  }

  this._injectPayload[key] = value;
};

http.OutgoingMessage.prototype.getContent = function getContent(key) {
  if(this._injectPayload) {
    return _.clone(this._injectPayload[key]);
  } else {
    return null;
  }
};

// overrides
var originalWrite = http.OutgoingMessage.prototype.write;
http.OutgoingMessage.prototype.write = function(chunk, encoding) {
  //this.pushContent('test', 'hello world');
  var condition =
    this._injectPayload && !this._injected &&
    encoding === undefined &&
    /<!DOCTYPE html>/.test(chunk);

  if(condition) {
    // if cors headers included if may cause some security holes
    // so we simply turn off injecting if we detect an cors header
    // read more: http://goo.gl/eGwb4e
    if(this._headers['access-control-allow-origin']) {
      var warnMessage = 'Warn: server-side HTML rendering turned off due to CORS headers. ';
      console.warn(warnMessage);
      originalWrite.call(this, chunk, encoding);
      return;
    }

    // inject data
    var injectHtml = InjectHtml._encode(this._injectPayload);

    // if this is a buffer, convert it to string
    chunk = chunk.toString();
    chunk = chunk.replace('</body>', injectHtml + '\n</body>');

    this._injected = true;
  }

  originalWrite.call(this, chunk, encoding);
};
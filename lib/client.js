Meteor.startup(function() {
	//TODO: This seems to just be pulling a 'copy' of the data in for client ref, will instead need to do cleanup here to remove pre-rendered for browsers where the javascript will no correctly take over rendering.
  //var dom = $('script[type="text/inject-data"]', document.head);
  //var injectedDataString = dom.text().trim();
  //InjectHtml._data = InjectData._decode(injectedDataString) || {};
});

InjectHtml.getContent = function(key, callback) {
  Meteor.startup(function() {
  	if(callback) {
	    callback(InjectHtml._content[key]);
	  }
  });
};
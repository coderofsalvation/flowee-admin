 function init(swagger){
  console.dir(swagger)
  var myApp = angular.module('myApp', ['ng-admin']);
  myApp.config(['NgAdminConfigurationProvider', function(NgAdminConfigurationProvider) {
      var nga = NgAdminConfigurationProvider;
      // create an admin application
      var admin = nga.application('Title here');
      admin.baseApiUrl(window.apiURI);
      initSwagger(swagger,admin,nga)      
      nga.configure(admin);
  }]);
  angular.bootstrap(document, ['myApp']);
}

function initSwagger(swagger,admin,nga){
  var entities = {}
  for( endpoint in swagger.paths ){
    var path = swagger.paths[endpoint]
    var depth = endpoint.split("/").length
    if( depth != 2 ) continue // skip complex urls for now
    var name = endpoint.replace(/\//g,'')
    var entity = entities[ name ] = nga.entity( name ) 
    entity.listView().fields([
        nga.field('name'),
        nga.field('username'),
        nga.field('email')
    ]);
    admin.addEntity( entity )
  }
}

init.bind(window)

fetch( window.swaggerURI )
.then(function(response) {
  return response.json()
}).then(function(json) {
  init.apply(window,[json])
})

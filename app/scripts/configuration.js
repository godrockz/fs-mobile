'use strict';

 angular.module('config', [])
     // TODO: Added apiEndpoint again to run this...
.constant('ENV', {name:'development',apiEndpoint:'http://localhost:8080',possibleApiEndpoint1:'http://localhost:8080',possibleApiEndpoint2:'http://localhost:8080',offlineJsonDataDirectory:'scripts/data'})

;

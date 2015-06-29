'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',apiEndpoint:'http://dev-fs-rest-service.herokuapp.com',offlineJsonDataDirectory:'scripts/data'})

;
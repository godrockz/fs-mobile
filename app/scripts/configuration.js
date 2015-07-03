'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',remoteApiEndpoint:'http://localhost:8080',localApiEndpoint:'http://localhost:8080',offlineJsonDataDirectory:'scripts/data'})

;
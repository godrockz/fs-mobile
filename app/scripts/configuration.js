'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',remoteApiEndpoint:'http://192.168.178.32:8080',localApiEndpoint:'http://192.168.178.32:8080',offlineJsonDataDirectory:'scripts/data'})

;
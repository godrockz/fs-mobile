'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',remoteApiEndpoint:'http://fs.spektacholeriker.de:8080',localApiEndpoint:'http://spektacholeriker.de:8080',offlineJsonDataDirectory:'scripts/data'})

;

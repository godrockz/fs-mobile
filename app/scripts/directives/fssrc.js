/**
 * <p/>
 * Created by Benjamin Jacob on 02.07.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.directives').directive('fsSrc',function($log, ConnectionState){
    var localImages = [
        'image/random1.jpg',
        'image/random2.jpg'
    ];
    function getRandomOfflineImage(){
        return localImages[Math.floor(Math.random()*localImages.length)];
    }

    return {
        restrict:'A',
        link:function(scope, elem, attrs){
            console.log('fsSrc running');
            if(!attrs.fsSrc){
                $log.error("angular expression expected within fs-src attribute");
            }
            var onlineSrc = scope.$eval(attrs.fsSrc);
            console.log('got as online src',onlineSrc);
            ConnectionState.isOnline().then(function(isOnline){
                if(isOnline){
                    console.log('isOnline true');
                    attrs.$set('src',onlineSrc);
                }else{
                    console.log('isOnline false');
                    attrs.$set('src',getRandomOfflineImage());
                }
            },function(err){
                console.log('err',err);
                attrs.$set('src',getRandomOfflineImage());
            });
        }
    }
});

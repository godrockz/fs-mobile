/**
 * simple filters
 * <p/>
 * Created by Benjamin Jacob on 09.03.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.filters',[]).
    filter('ucFirst',function(){
       return function(str){
           return str.substring(0,1).toUpperCase()+str.substring(1);
       };
    });

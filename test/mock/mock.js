/**
 * mock utility
 * <p/>
 * Created by Benjamin Jacob on 26.02.15.
 * <p/>
 */
angular.module('testUtils',[]).service('mocks',function($window){
    var chance = $window.chance;
    chance.mixin({

        eventType : function(){
            var types = ['Concert', 'Workshop', 'Seminar', 'Service'];
            return chance.pick(types,1);
        },

        eventState: function(){
            var types = ['Past', 'Upcoming', 'Canceled'];
            return chance.pick(types,1);
        },

        event:function(opts){
            var defaults = {
                id: chance.natural({min: 0, max: 9999}),
                type: chance.eventType(),
                name: chance.word(),
                description: chance.sentence(),
                startTime: chance.date(),
                endTime: chance.date(),
                artist: chance.natural({min: 0, max: 9999}),
                location: chance.natural({min: 0, max: 9999}),
                state: chance.eventState()
            };
            return angular.extend(defaults, opts);
        }

    });
    return chance;
});

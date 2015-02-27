/**
 * <p/>
 * Created by Benjamin Jacob on 26.02.15.
 * <p/>
 */
'use strict';
describe('Storage Module',function(){

    var mocks, Storage, $rootScope;

    beforeEach(function(){
        module('testUtils');
        module('LocalForageModule');
        module('fsMobile.storage');
        inject(function (_mocks_, _Storage_, _$rootScope_) {
            mocks = _mocks_;
            Storage = _Storage_;
            $rootScope = _$rootScope_;

        });
    });



    it('should mock an event ',function(){
       expect(mocks.event()).not.toBeUndefined();
    });

    it('should allow to store data ',function(done) {
        var storage = new Storage('EVENTS'),
            data = mocks.event();
        storage.add(data).then(function(storedItem){
            expect(storedItem).toEqual(data);
            storage.get().then(function(){

            });
        },function(err){
            expect(false).toBe(true,err);
        })['finally'](done);

        $rootScope.$apply();
    });

});

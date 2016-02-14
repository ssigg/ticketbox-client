'use strict';

describe('ticketbox.customer.checkout', function () {
    var $firebaseArray, $firebaseObject, $timeout, scope, ref, fbarray, locker, byPathSpy, getMyLocksSpy, unlockSpy;
    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is the first object'
        },
        'id2': {
            'name': 'This is the second object'
        }
    };

    beforeEach(function () {
        module('ticketbox.components.utils');
        module('ticketbox.customer.checkout');

        inject(function (_$firebaseArray_, _$firebaseObject_, _$timeout_, _$rootScope_, _fbarray_, _locker_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();

            fbarray = _fbarray_;
            byPathSpy = spyOn(fbarray, 'byPath').and.returnValue(_makeArray(FIXTURE_DATA, ref));

            locker = _locker_;
            getMyLocksSpy = spyOn(locker, 'getMyLocks').and.returnValue(_makeArray(FIXTURE_DATA, ref));
            unlockSpy = spyOn(locker, 'unlock');

            $controller('CheckoutCtrl', {$scope: scope, fbarray: fbarray, locker: locker});
            scope.$digest();
        });
    });

    describe('CheckoutCtrl', function () {
        describe('$scope.locks', function () {
            it('should fetch my locks', function () {
                expect(getMyLocksSpy).toHaveBeenCalled();
            });
        });

        describe('$scope.events', function () {
            it('should fetch events', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/events');
            });
        });

        describe('$scope.seats', function () {
            it('should fetch seats', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/seats');
            });
        });

        describe('$scope.blocks', function () {
            it('should fetch blocks', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/blocks');
            });
        });

        describe('$scope.unlock()', function () {
            it('should unlock given lock', function () {
                var lock = {
                    '$id': 'eid1:sid1'
                };
                expect(unlockSpy).not.toHaveBeenCalled();
                scope.unlock(lock);
                expect(unlockSpy).toHaveBeenCalledWith('eid1', 'sid1');
            });
        });
    });

    function _makeArray(initialData, fbref) {
        if (!fbref) {
            fbref = _stubRef();
        }
        var fbarray = $firebaseArray(fbref);
        if (angular.isDefined(initialData)) {
            fbref.ref().set(initialData);
            fbref.flush();
            $timeout.flush();
        }
        return fbarray;
    }

    function _stubRef() {
        return new MockFirebase('Mock://');
    }
});

describe('ticketbox.customer.checkout', function() {
    var eventNameFilter, seatNameFilter, blockDisplayNameFilter;

    beforeEach(function() {
        angular.mock.module('ticketbox.customer.checkout', function($provide) {
            $provide.value('separator', ':');
        });

        inject(function($filter) {
            eventNameFilter = $filter('eventNameFilter', {});
            seatNameFilter = $filter('seatNameFilter', {});
            blockDisplayNameFilter = $filter('blockDisplayNameFilter', {});
        });
    });

    describe('eventNameFilter', function() {
        it('should select event and return its name', function() {
            var lock = {
                "$id": "eid1:sid1"
            };
            var events = [
                { "$id": "eid2", "name": "Event 2" },
                { "$id": "eid1", "name": "Event 1" }
            ];
            var eventName = eventNameFilter(lock, events);
            expect(eventName).toEqual("Event 1");
        });
    });

    describe('seatNameFilter', function() {
        it('should select seat and return its name', function() {
            var lock = {
                "$id": "eid1:sid1"
            };
            var seats = [
                { "$id": "sid2", "name": "Seat 2" },
                { "$id": "sid1", "name": "Seat 1" }
            ];
            var seatName = seatNameFilter(lock, seats);
            expect(seatName).toEqual("Seat 1");
        });
    });

    describe('blockDisplayNameFilter', function() {
        it('should select block and return its display name', function() {
            var lock = {
                "$id": "eid1:sid1"
            };
            var seats = [
                { "$id": "sid2", "name": "Seat 2", "blockId": "bid2" },
                { "$id": "sid1", "name": "Seat 1", "blockId": "bid1" }
            ];
            var blocks = [
                { "$id": "bid2", "displayName": "Block 2" },
                { "$id": "bid1", "displayName": "Block 1" }
            ];
            var eventName = blockDisplayNameFilter(lock, seats, blocks);
            expect(eventName).toEqual("Block 1");
        });
    });
});
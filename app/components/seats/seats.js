'use strict';

angular.module('ticketbox.components.seats', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.locker',
        'ticketbox.components.seatplan',
        'ngRoute'])

    .controller('SeatsCtrl', function ($scope, $routeParams, fbarray, fbobject, locker, separator) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.block = fbobject.byId('/blocks', $routeParams.blockId);
        $scope.seats = fbarray.byChildValue('/seats', 'blockId', $routeParams.blockId);
        $scope.reservations = locker.getLocksOfEvent($routeParams.eventId);
        $scope.myLocks = locker.getMyLocks();
        $scope.allEvents = fbarray.byPath('/events');
        $scope.allSeats = fbarray.byPath('/seats');
        $scope.allBlocks = fbarray.byPath('/blocks');
        $scope.allCategories = fbarray.byPath('/categories');

        $scope.numberOfSeatsToBeLocked = 1;

        $scope.reserve = function(numberOfSeatsToBeLocked) {
            var eventId = $routeParams.eventId;
            var numberOfFetchedLocks = 0;
            locker.getLocksOfEvent(eventId).$loaded(function(locks) {
                _.each($scope.seats, function(seat) {
                    var lockedSeatIds = _.map(locks, function(lock) { return lock.seatId; });
                    if (numberOfFetchedLocks < numberOfSeatsToBeLocked && !_.contains(lockedSeatIds, seat.$id)) {
                        locker.lock(eventId, seat.$id);
                        numberOfFetchedLocks += 1;
                    }
                });
            });
        };

        $scope.saveLock = function(lock) {
            $scope.myLocks.$save(lock);
        };

        $scope.unlock = function (lock) {
            var eventId = lock.$id.split(separator)[0];
            var seatId = lock.$id.split(separator)[1];
            locker.unlock(eventId, seatId);
        };
    });
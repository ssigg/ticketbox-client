'use strict';

angular.module('ticketbox.customer.toolbar', [
    'ticketbox.components.firebase',
    'ticketbox.components.locker',
    'ticketbox.components.price',
    'ticketbox.customer.price'])

    .controller('ToolbarCtrl', function ($rootScope, $scope, $location, fbarray, locker) {
        $scope.locks = locker.getMyLocks();
        $scope.allEvents = fbarray.byPath('/events');
        $scope.allSeats = fbarray.byPath('/seats');
        $scope.allBlocks = fbarray.byPath('/blocks');
        $scope.allCategories = fbarray.byPath('/categories');

        $scope.cancel = function() {
            _.each($scope.locks, function(lock) {
                locker.unlockWithLock(lock);
                $location.path('/events');
            });
        };
    });
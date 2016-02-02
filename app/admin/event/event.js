'use strict';

angular.module('ticketbox.admin.event', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events/:eventId', {
            controller: 'EventCtrl',
            templateUrl: 'admin/event/event.html'
        });
    }])

    .controller('EventCtrl', function($scope, $routeParams, fbobject, fbarray, error) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.eventBlocks = fbarray.byPath('/events/' + $routeParams.eventId + '/blocks');

        $scope.blocks = fbarray.byPath('/blocks');
        $scope.categories = fbarray.byPath('/categories');

        $scope.addBlock = function(blockId, categoryId) {
            $scope.eventBlocks.$add({ 'blockId': blockId, 'categoryId': categoryId })
                .then(function() { }, error)
                .finally(function() {
                    $scope.newBlockId = undefined;
                    $scope.newCategoryId = undefined;
                });
        };

        $scope.removeBlock = function(eventBlock) {
            $scope.eventBlocks.$remove(eventBlock).then(function () { }, error);
        };
    })

    .filter('nameFilter', function() {
        return function(id, dictionary) {
            var item = dictionary.$getRecord(id);
            if (item !== null) {
                return item.name;
            } else {
                return '';
            }
        }
    });
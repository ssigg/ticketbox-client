'use strict';

describe('ticketbox.admin.blocks', function () {
    var $firebaseArray, $timeout, scope, ref, fbarray;

    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is block 1'
        },
        'id2': {
            'name': 'This is block 2'
        }
    };

    beforeEach(function () {
        module('ticketbox.admin.blocks');

        inject(function (_$firebaseArray_, _$timeout_, _$rootScope_, $controller, $q) {
            $firebaseArray = _$firebaseArray_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();
            fbarray = {
                byPath: function () {
                    return _makeArray(FIXTURE_DATA, ref);
                }
            };

            $controller('BlocksCtrl', {$scope: scope, fbarray: fbarray});
            scope.$digest();
        });
    });

    describe('BlocksCtrl', function () {
        describe('$scope.blocks', function () {
            it('should contain all items', function () {
                expect(scope.blocks.$getRecord('id1')).not.toBeNull();
                expect(scope.blocks.$getRecord('id2')).not.toBeNull();
            });
        });

        describe('$scope.add()', function () {
            it('should add an item', function () {
                var initialDataLength = scope.blocks.length;
                scope.add('new block name', null);
                _flush();
                var eventualDataLength = scope.blocks.length;
                expect(eventualDataLength).toEqual(initialDataLength + 1);
            });

            it('should empty the newBlockName variable', function () {
                scope.newBlockName = 'newBlockNameValue';
                scope.add('new block name', null);
                _flush();
                expect(scope.newBlockName).toEqual('');
            });
        });

        describe('$scope.remove()', function () {
            var arrayModification;
            beforeEach(function() {
                inject(function (_$firebaseArray_, _$timeout_, _$rootScope_, $controller, $q) {
                    arrayModification = {
                        removeAll: function () {
                        }
                    };
                    fbarray.byChildValue = function() {
                        return {
                            $loaded: function() {
                                arrayModification.removeAll();
                            }
                        }
                    };

                    $controller('BlocksCtrl', {$scope: scope, fbarray: fbarray, arrayModification: arrayModification});
                    scope.$digest();
                });
            });

            it('should call removeAll for the blocks seats when removing a block', function () {
                var action = arrayModification.removeAll();
                var item = scope.blocks.$getRecord('id1');
                var removeAllSpy = spyOn(arrayModification, 'removeAll');
                scope.remove(item);
                expect(removeAllSpy).toHaveBeenCalled();
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

    function _flush() {
        ref.flush();
        $timeout.flush();
    }
});
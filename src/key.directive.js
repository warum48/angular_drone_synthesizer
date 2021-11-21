angular.module('droneSynthApp').directive('key', function($rootScope) {
    return {
        link: function($scope, element, attrs) {
            $scope.isActive = false;

            $scope.toggleActive = function() {
                if ($scope.isActive) {
                    $scope.deactivate();
                }
                else {
                    $scope.activate();
                }
            }

            $scope.activate = function() {
                console.log('activate');
                $scope.isActive = true;
                /*$scope.$emit('keyactivate', {
                    index: attrs.index
                });*/
                $rootScope.$broadcast('keyactivate', {
                    index: attrs.index
                });
            }

            $scope.deactivate = function() {
                console.log('deactivate');
                $scope.isActive = false;
                /*$scope.$emit('keydeactivate', {
                    index: attrs.index
                });*/
                $rootScope.$broadcast('keydeactivate', {
                    index: attrs.index
                });
            }

            $rootScope.$on('keydeactivate', function(event, data) {
                if (data.index == attrs.index) {
                    $scope.isActive = false;
                }
            });
            $rootScope.$on('keyactivate', function(event, data) {
                if (data.index == attrs.index) {
                    $scope.isActive = true;
                }
            });
        }
    }
});
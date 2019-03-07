(function (angular) {
    angular.module("weblogger").controller("MainController", function ($scope, $rootScope, $location) {

        $scope.isActive = function (path) {
            return $location.path().indexOf(path) > -1;
        };

    });
})(angular);
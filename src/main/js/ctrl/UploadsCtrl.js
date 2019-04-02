(function (angular) {
    angular.module("weblogger")
        .controller('UploadsCtrl', function ($scope, UploadsService, $location) {
            $scope.platforms = ["ANDROID", "IOS"];
            $scope.selectedPlatform = "ANDROID";

            $scope.uploadZip = function () {
                UploadsService.uploadZipFile($scope.zipFile, $scope.selectedPlatform, $scope.folder).then(function (response) {

                });
            };
        });
})(angular);
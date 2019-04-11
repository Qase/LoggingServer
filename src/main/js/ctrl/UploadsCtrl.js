(function (angular) {
    angular.module("weblogger")
        .controller('UploadsCtrl', function ($scope, UploadsService, $location) {
            $scope.platforms = ["ANDROID", "IOS"];
            $scope.upload = {
                platform: "ANDROID"
            };
            $scope.selection = {
                platform: "ANDROID"
            };
            $scope.logs = [];

            $scope.filter = {
                messageFilter: null,
                logSeverities: {
                    VERBOSE: false,
                    DEBUG: false,
                    INFO: false,
                    WARNING: false,
                    ERROR: false,
                    FATAL: false,
                }
            };

            $scope.changeMode = function (mode) {
                if (mode !== 'UPLOAD') {
                    $scope.loadFolders();
                }
                $scope.mode = mode;
                $location.search('mode', mode);
            };

            $scope.loadFolders = function () {
                UploadsService.getFolders($scope.selection.platform).then(function (response) {
                    $scope.folders = response.data;
                });
            };

            $scope.loadDbNames = function () {
                UploadsService.getDbNames($scope.selection.platform, $scope.selection.folder).then(function (response) {
                    $scope.dbNames = response.data;
                });
            };
            $scope.loadLogs = function () {
                UploadsService.getLogs($scope.selection.platform, $scope.selection.folder, $scope.selection.fileName).then(function (response) {
                    $scope.logs = response.data;
                });
            };

            let mode = $location.search().mode;
            if (mode) {
                $scope.changeMode(mode);
            } else {
                $scope.changeMode('UPLOAD');
            }

            $scope.uploadZip = function () {
                UploadsService.uploadZipFile($scope.upload.zipFile, $scope.upload.platform, $scope.upload.folder).then(function (response) {
                    $scope.changeMode($scope.upload.platform);
                });
            };
            $scope.showFolder = function (platform, folder) {
                UploadsService.listFolder(platform, folder).then(function (response) {
                    $scope.dbList = response.data;
                });
            };
        });
})(angular);
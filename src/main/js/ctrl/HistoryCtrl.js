(function (angular) {
    angular.module("weblogger")
        .controller('HistoryCtrl', function ($scope, $http, restUrl, refreshInterval, HistoryService, $location,
                                             $anchorScroll, $timeout, $window) {
            $scope.selectedSession = null;
            $scope.selectedFile = null;
            $scope.history = [];
            $scope.allSessions = [{label: "All", value: null}];
            $scope.sessionLogs = [];
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
            $scope.isCollapsed = false;
            // $scope.tracking = true;
            $scope.updateHistory = function () {
                HistoryService.getHistory().then(function (response) {
                    $scope.history = response.data;
                });
            };
            $scope.updateHistory();
            $scope.downloadSessions = function () {
                HistoryService.getSessions($scope.selectedFile).then(function (response) {
                    $scope.allSessions = [{label: "Všechny", value: null}];
                    response.data.forEach(function (session) {
                        $scope.allSessions.push({value: session, label: session});
                    });
                    $scope.selectedSession = null;
                    $scope.downloadSessionLogs();
                }, function (err) {
                    console.log(err);
                });
            };

            $scope.downloadSessionLogs = function () {
                HistoryService.getLogs($scope.selectedFile, $scope.selectedSession).then(function (response) {
                    $scope.sessionLogs = response.data;
                }, function (err) {
                    console.log(err);
                });
            };

            $scope.goToTop = function () {
                $window.scrollTo(0, 0);
            };

            $scope.downloadUrl = function () {
                return restUrl + 'logs/history/' + $scope.selectedFile + '/download';
            };

            $scope.deleteFile = function () {
                HistoryService.deleteHistory($scope.selectedFile).then(function (response) {
                    $scope.selectedFile = null;
                    $scope.selectedSession = null;
                    $scope.sessionLogs = [];
                });
            };
        });
})(angular);
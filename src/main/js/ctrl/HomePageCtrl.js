(function (angular) {
    angular.module("weblogger")
        .controller('HomePageCtrl', function ($scope, $http, restUrl, refreshInterval, LogService) {
            $scope.selectedSession = null;
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

            $scope.onDeleteSessionLogsClicked = function () {
                LogService.deleteLogs($scope.selectedSession).then(function (response) {
                    $scope.sessionChanged();
                }, function (err) {
                    console.log(err);
                });

            };

            $scope.sessionChanged = function () {
                $scope.lastUpdated = null;
                $scope.sessionLogs = [];
                $scope.refreshData();
            };
            $scope.downloadUrl = function () {
                return restUrl + 'log/download' + ($scope.selectedSession ? '?sessionName=' + $scope.selectedSession : '');
            };

            $scope.downloadSessions = function () {
                LogService.getAllSessions().then(function (response) {
                    $scope.allSessions = [{label: "Všechny", value: null}];
                    response.data.forEach(function (session) {
                        $scope.allSessions.push({value: session, label: session});
                    })
                }, function (err) {
                    console.log(err);
                });
            };

            $scope.downloadSessionLogs = function () {
                LogService.getLogs($scope.selectedSession, $scope.lastUpdated).then(function (response) {
                    if (response.data.length > 0) {
                        $scope.lastUpdated = response.data[response.data.length - 1].timestamp;
                        $scope.sessionLogs = $scope.sessionLogs.concat(response.data);
                    }
                }, function (err) {
                    console.log(err);
                });
            };

            $scope.refreshData = function () {
                $scope.downloadSessions();
                $scope.downloadSessionLogs();
            };

            $scope.init = function () {
                $scope.refreshData();
                setInterval(function () {
                    $scope.refreshData()
                }, refreshInterval);
            };

            $scope.init();
        });
})(angular);
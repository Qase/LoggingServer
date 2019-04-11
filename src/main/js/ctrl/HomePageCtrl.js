(function (angular) {
    angular.module("weblogger")
        .controller('HomePageCtrl', function ($scope, $http, restUrl, refreshInterval, LogService, $location,
                                              $anchorScroll, $timeout, $window, $interval) {
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
            $scope.tracking = true;

            $scope.goToTop = function () {
                $scope.tracking = false;
                $window.scrollTo(0, 0);
            };

            $scope.goToBottom = function () {
                $timeout(function () {
                    $location.hash('bottom');
                    $anchorScroll();
                }, 0, false);
            };

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
                    });
                }, function (err) {
                    console.log(err);
                });
            };

            $scope.downloadSessionLogs = function () {
                LogService.getLogs($scope.selectedSession, $scope.lastUpdated).then(function (response) {
                    if (response.data.length > 0) {
                        $scope.lastUpdated = response.data[response.data.length - 1].timestamp;
                        $scope.sessionLogs = $scope.sessionLogs.concat(response.data);
                        if ($scope.tracking) {
                            $scope.goToBottom();
                        }
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
                $scope.interval = $interval(function () {
                    $scope.refreshData();
                }, refreshInterval);
            };
            $scope.$on("$destroy", function () {
                if ($scope.interval) {
                    $interval.cancel($scope.interval);
                }
            });

            $scope.init();
        });
})(angular);
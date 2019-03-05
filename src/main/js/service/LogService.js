(function (angular) {
    angular.module("weblogger")
        .service("LogService", function ($http, restUrl) {
            return {
                getAllSessions: function () {
                    return $http({
                        method: 'GET',
                        url: restUrl + 'session'
                    });
                },
                getLogs: function (selectedSession, lastUpdated) {
                    return $http({
                        method: 'GET',
                        url: restUrl + 'log',
                        params: {
                            sessionName: selectedSession,
                            lastUpdated: lastUpdated
                        }
                    });
                },
                deleteLogs: function (selectedSession) {
                    return $http({
                        method: 'DELETE',
                        url: restUrl + 'log',
                        params: {
                            sessionName: selectedSession,
                        }
                    });
                }
            };
        });
})(angular);
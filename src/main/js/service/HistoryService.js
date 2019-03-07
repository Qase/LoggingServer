(function (angular) {
    angular.module("weblogger")
        .service("HistoryService", function ($http, restUrl) {
            return {
                getHistory: function () {
                    return $http({
                        method: 'GET',
                        url: restUrl + 'logs/history'
                    });
                },
                getSessions: function (fileName) {
                    return $http({
                        method: 'GET',
                        url: restUrl + 'logs/history/' + fileName + '/sessions'
                    });
                },
                getLogs: function (fileName, sessionName) {
                    return $http({
                        method: 'GET',
                        url: restUrl + 'logs/history/' + fileName,
                        params: {
                            sessionName: sessionName
                        }
                    });
                },
                deleteHistory: function (fileName) {
                    return $http({
                        method: 'DELETE',
                        url: restUrl + 'logs/history/' + fileName
                    });
                }
            };
        });
})(angular);
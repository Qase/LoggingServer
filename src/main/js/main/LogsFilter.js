(function (angular) {
    angular.module("weblogger").filter('logsFilter', function () {
    function areAllSeveritiesUnchecked(severities) {
        for (const type in severities) {
            if (!severities.hasOwnProperty(type)) continue;
            if (severities[type]) {
                return false;
            }
        }
        return true;
    }

    return function (logs, filterConfig) {
        const filteredLogs = [];
        const noneSeverityChecked = areAllSeveritiesUnchecked(filterConfig.logSeverities);
        for (let i = 0; i < logs.length; i++) {
            const log = logs[i];
            if (filterConfig.messageFilter !== null && log.message.toLowerCase().indexOf(filterConfig.messageFilter.toLowerCase()) < 0) {
                continue;
            }
            if (noneSeverityChecked || (filterConfig.logSeverities[log.severity])) {
                filteredLogs.push(log);
            }
        }
        return filteredLogs;
    }
})
})(angular);
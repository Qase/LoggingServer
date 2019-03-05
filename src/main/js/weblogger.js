(function (angular) {
    angular.module("weblogger", ["ngRoute", "ui.bootstrap"])
        .constant("restUrl", '/api/v1/')
        .constant("refreshInterval", 1000)
})(angular);
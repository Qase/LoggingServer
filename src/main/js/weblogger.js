(function (angular) {
    angular.module("weblogger", ["ngRoute"])
        .constant("restUrl", '/api/v1/')
        .constant("refreshInterval", 1000)
})(angular);
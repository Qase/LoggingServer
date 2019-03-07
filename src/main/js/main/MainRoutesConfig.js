(function (angular) {
    angular.module('weblogger')
        .config(
            function ($routeProvider, $locationProvider) {

                $routeProvider.when('/home', {
                    templateUrl: 'tmpl/home-page.tmpl.html',
                    controller: 'HomePageCtrl'
                });
                $routeProvider.when('/history', {
                    templateUrl: 'tmpl/history.tmpl.html',
                    controller: 'HistoryCtrl'
                });

                $locationProvider.html5Mode(true);

                $routeProvider.otherwise({
                    redirectTo: '/home'
                });
            }
        );
})
(angular);
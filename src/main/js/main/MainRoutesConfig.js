(function (angular) {
    angular.module('weblogger')
        .config(
            function ($routeProvider, $locationProvider) {

                $routeProvider.when('/home', {
                    templateUrl: 'tmpl/home-page.tmpl.html',
                    controller: 'HomePageCtrl'
                });

                $locationProvider.html5Mode(true);

                $routeProvider.otherwise({
                    redirectTo: '/home'
                });
            }
        );
})
(angular);
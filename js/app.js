var app = angular.module("dropAndPick", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'includes/pages/home.html',
            controller: 'homeCtrl'
        }).when('/home', {
            templateUrl: 'includes/pages/home.html',
            controller: 'homeCtrl'
        }).when('/login', {
            templateUrl: 'includes/pages/login.html',
            controller: 'loginCtrl'
        }).when('/login2', {
            templateUrl: 'includes/pages/login2.html',
            controller: 'loginCtrl'
        }).when('/signup', {
            templateUrl: 'includes/pages/signup.html',
            controller: 'signUpCtrl'
        }).when('/userPage', {
            resolve: {
                "check": function($location, $rootScope){
                    if (!$rootScope.loggedIn) {
                        $location.path('/login2')
                    }
                }
            },
            templateUrl: 'includes/pages/userPage.html',
            controller: 'userCtrl'
        });
});

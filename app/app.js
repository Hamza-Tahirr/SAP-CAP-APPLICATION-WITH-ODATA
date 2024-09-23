// app/app.js
const app = angular.module('CAP4App', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'login/login.html',
            controller: 'LoginController'
        })
        .when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/records', {
            templateUrl: 'records/records.html',
            controller: 'RecordsController'
        })
        .when('/records/add', {
            templateUrl: 'records/add.html', // Separate Add page
            controller: 'AddController'
        })
        .when('/records/edit/:id', {
            templateUrl: 'records/edit.html', // Separate Edit page
            controller: 'EditController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

// app/app.js
app.run(function($rootScope, $location) {
    $rootScope.logout = function() {
        $location.path('/');
    };
});
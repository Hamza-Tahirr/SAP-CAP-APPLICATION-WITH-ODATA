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
            templateUrl: 'records/add.html',
            controller: 'AddController'
        })
        .when('/records/edit/:Id', {  // Pass the ID for editing the record
            templateUrl: 'records/edit.html',
            controller: 'EditController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

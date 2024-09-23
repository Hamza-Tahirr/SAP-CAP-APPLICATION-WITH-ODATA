// app/login/login.js
app.controller('LoginController', function($scope, $location, $timeout) {
    $scope.username = '';
    $scope.password = '';
    $scope.flashMessage = '';

    $scope.login = function() {
        if ($scope.username === 'hamza' && $scope.password === 'hamza') {
            $location.path('/dashboard');
        } else {
            $scope.flashMessage = 'Invalid credentials, please try again.';
            $timeout(function() {
                $scope.flashMessage = '';
            }, 4000);
        }
    };
});

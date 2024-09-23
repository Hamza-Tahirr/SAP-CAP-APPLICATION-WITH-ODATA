// app/records/addEditController.js

app.controller('AddController', function($scope, $http, $location) {
    $scope.record = {};
    $scope.flashMessage = '';

    $scope.saveRecord = function() {
        $http.post('/api/records', $scope.record)
            .then(function(response) {
                $scope.flashMessage = 'Record added successfully!';
                $location.path('/records');
            })
            .catch(function(error) {
                console.error('Error adding record:', error);
                $scope.flashMessage = 'Error adding the record.';
            });
    };
});

app.controller('EditController', function($scope, $http, $routeParams, $location) {
    $scope.record = {};
    $scope.flashMessage = '';

    $http.get('/api/records/' + $routeParams.id)
        .then(function(response) {
            $scope.record = response.data;
        })
        .catch(function(error) {
            console.error('Error fetching record:', error);
            $scope.flashMessage = 'Error loading the record.';
        });

    $scope.saveRecord = function() {
        $http.put('/api/records/' + $scope.record.id, $scope.record)
            .then(function() {
                $scope.flashMessage = 'Record updated successfully!';
                $location.path('/records');
            })
            .catch(function(error) {
                console.error('Error updating record:', error);
                $scope.flashMessage = 'Error updating the record.';
            });
    };
});

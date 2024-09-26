// app/records/addEditController.js

// Controller for adding records
app.controller('AddController', function($scope, $http, $location) {
    $scope.record = {};  // Form data for the new record
    $scope.flashMessage = '';

    // Function to save a new record
    $scope.saveRecord = function() {
        $http.post('/api/records', $scope.record)
            .then(function(response) {
                $scope.flashMessage = 'Record added successfully!';
                $location.path('/records');  // Redirect to records page after saving
            })
            .catch(function(error) {
                console.error('Error adding record:', error);
                $scope.flashMessage = 'Error adding the record.';
            });
    };
});

// Controller for editing records
app.controller('EditController', function($scope, $http, $routeParams, $location) {
    $scope.record = {};  // Holds the record to be edited
    $scope.flashMessage = '';

    // Fetch the record by its ID
    $http.get('/api/records/' + $routeParams.Id)  // Capture the ID from the URL
        .then(function(response) {
            $scope.record = response.data;  // Prepopulate form with fetched data
        })
        .catch(function(error) {
            console.error('Error fetching record:', error);
            $scope.flashMessage = 'Error loading the record.';
        });

    // Function to save the updated record
    $scope.saveRecord = function() {
        // PUT request to update the record
        $http.put('/api/records/' + $scope.record.Id, $scope.record)
            .then(function() {
                $scope.flashMessage = 'Record updated successfully!';
                // Redirect to records page after successful update
                $location.path('/records');
            })
            .catch(function(error) {
                console.error('Error updating record:', error);
                $scope.flashMessage = 'Error updating the record.';
            });
    };
});

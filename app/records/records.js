// Define the 'RecordsController' in the AngularJS app
app.controller('RecordsController', function($scope, $http) {
    // Initialize an empty array to store the fetched records
    $scope.records = [];
    
    // Variable to store the currently selected record
    $scope.selectedRecord = null;

    // Function to fetch all records from the server
    $scope.fetchRecords = function() {
        // HTTP GET request to fetch records from the API
        $http.get('/api/records')
            .then(function(response) {
                // On success, populate $scope.records with the response data
                $scope.records = response.data;
            })
            .catch(function(error) {
                // Log an error message if the request fails
                console.error('Error fetching records:', error);
            });
    };

    // Function to set a record as the selected record
    $scope.selectRecord = function(record) {
        // Set the selected record to the one passed as an argument
        $scope.selectedRecord = record;
    };

    // Function to delete selected records
    $scope.deleteSelectedRecords = function() {
        // Filter the records array to get only those records marked as selected
        const selectedRecords = $scope.records.filter(record => record.selected);

        // Check if there are any selected records and confirm the deletion
        if (selectedRecords.length > 0 && confirm('Are you sure you want to delete the selected records?')) {
            // Iterate over each selected record
            selectedRecords.forEach(record => {
                // HTTP DELETE request to delete the selected record by its ID
                $http.delete('/api/records/' + record.id)
                    .then(function() {
                        // On success, remove the record from the records array
                        const index = $scope.records.indexOf(record);
                        if (index > -1) {
                            $scope.records.splice(index, 1); // Remove record from the array
                        }
                    })
                    .catch(function(error) {
                        // Log an error message if the deletion fails
                        console.error('Error deleting record:', error);
                    });
            });
        }
    };

    // Fetch all records when the controller is initialized
    $scope.fetchRecords();
});

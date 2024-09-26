// app/records/records.js
app.controller('RecordsController', function($scope, $http) {
    $scope.records = [];
    $scope.selectedRecord = null;

    // Fetch all records from the OData service
    $scope.fetchRecords = function() {
        $http.get('/api/records')
            .then(function(response) {
                $scope.records = response.data;  // Refresh records array
            })
            .catch(function(error) {
                console.error('Error fetching records:', error);
            });
    };

    // Select a record from the table
    $scope.selectRecord = function(record) {
        $scope.selectedRecord = record;
    };

    // Delete selected records
    $scope.deleteSelectedRecords = function() {
        const selectedRecords = $scope.records.filter(record => record.selected);

        if (selectedRecords.length > 0 && confirm('Are you sure you want to delete the selected records?')) {
            selectedRecords.forEach(record => {
                $http.delete('/api/records/' + record.Id)
                    .then(function() {
                        const index = $scope.records.indexOf(record);
                        if (index > -1) {
                            $scope.records.splice(index, 1);  // Remove from array
                        }
                    })
                    .catch(function(error) {
                        console.error('Error deleting record:', error);
                    });
            });
        }
    };

    // Fetch records when returning to the records page
    $scope.fetchRecords();  // Ensure data is reloaded after navigation
});

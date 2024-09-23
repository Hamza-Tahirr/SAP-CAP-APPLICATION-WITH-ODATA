// app/dashboard/dashboard.js
app.controller('DashboardController', function($scope, $http, $location) {
    gsap.from(".sidebar", { duration: 1, x: -250 });

    $scope.totalEmployees = 0;
    $scope.totalIDsGenerated = 0;
    $scope.totalOffices = 0;

    // Fetch records to calculate stats
    $scope.fetchRecords = function() {
        $http.get('/api/records')
            .then(function(response) {
                const records = response.data;
                
                // Total number of employees
                $scope.totalEmployees = records.length;
                
                // Total IDs Generated - get the highest ID
                if (records.length > 0) {
                    $scope.totalIDsGenerated = Math.max(...records.map(record => record.id));
                }

                // Total Number of Offices - count unique office names
                const offices = new Set(records.map(record => record.office));
                $scope.totalOffices = offices.size;
            })
            .catch(function(error) {
                console.error('Error fetching records:', error);
            });
    };

    // Initialize
    $scope.fetchRecords();

    // Logout function
    $scope.logout = function() {
        $location.path('/');
    };
});

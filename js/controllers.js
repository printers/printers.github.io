app.controller('MainController', function($scope, $routeParams, $http){
	
	$scope.orderByField = 'id';
  	$scope.reverseSort = false;

  	// Filters

  	$scope.filters = 'B/W';

    // Get project data
    $http.get("js/printers.json").success(function(data) {
     	$scope.printers = data;
    });


    // Filter color

    $scope.activateColor = function(activate){
    	if (activate){
    		$scope.filters = 'Color';
    	} else {
    		$scope.filters = 'B/W';
    	}
    }

    $scope.activeColor = function(tag){
    	if (tag == $scope.filters){
    		return "button active-button";
    	} else {
    		return "button";
    	}
    }

    $scope.order = function(field){
    	if (field == $scope.orderByField){
    		$scope.reverseSort = !$scope.reverseSort;
    	}
    	$scope.orderByField = field;

    }

    $scope.activeOrder = function(field){
    	if ($scope.orderByField == field){
    		return "active-field";
    	}
    }


});
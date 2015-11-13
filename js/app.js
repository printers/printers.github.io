var app = angular.module('myApp', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
        	templateUrl: 'partials/home.html',
            controller: 'MainController'
        })
     	.when('/about', {
        	templateUrl: 'partials/about.html',
            
        })
        .when('/project/:id',{
            templateUrl: 'partials/project.html',
            controller: 'MainController'
        })
    
    	.otherwise({
            redirectTo: '/'
        });
}]);


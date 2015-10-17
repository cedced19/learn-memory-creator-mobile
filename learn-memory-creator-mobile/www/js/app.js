angular.module('LearnMemory', ['ngRoute', 'ngStorage', 'ngSanitize', 'ngTouch'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'LearnMemoryHomeCtrl'
    })
    .when('/create', {
        templateUrl: 'views/creation-form.html',
        controller: 'LearnMemoryCreateCtrl'
    })
    .when('/update', {
        templateUrl: 'views/list.html',
        controller: 'LearnMemoryUpdateCtrl'
    })
    .when('/update/:id', {
        templateUrl: 'views/update-form.html',
        controller: 'LearnMemoryUpdateItemCtrl'
    })
    .when('/config', {
        templateUrl: 'views/config.html',
        controller: 'LearnMemoryConfigCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}])
.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$menu = {
        show: function () {
            if ($rootScope.nav != 'home') {
                document.getElementsByTagName('body')[0].classList.add('with-sidebar');
            }
        },
        hide: function (path) {
            document.getElementsByTagName('body')[0].classList.remove('with-sidebar');
            if (path) {
                $location.path('/' + path);
            }
        }
    };
}])
.controller('LearnMemoryHomeCtrl', function ($scope, $rootScope, $location, $localStorage) {
    $localStorage.$default({
        adress: ''
    });

    if (!$localStorage.adress) {
        $rootScope.nav = 'home';
        $scope.init = true;
        $scope.start = function () {
            $localStorage.adress = $scope.adress;
            $scope.init = false;
            $location.path('/update');
        };
    } else {
        $location.path('/update');
    }
}).controller('LearnMemoryCreateCtrl', function ($scope, $rootScope, $location, $localStorage, $http, $anchorScroll) {
    $anchorScroll();
    
    $rootScope.nav = 'create';

    $scope.login = false;

    $('textarea').autoResize();
}).controller('LearnMemoryUpdateCtrl', function ($scope, $rootScope, $location, $localStorage, $http, $anchorScroll) {
    $anchorScroll();

    $http.get('http://' + $localStorage.adress + '/api/').success(function (data) {
        $scope.lessons = data;
    });

    $rootScope.nav = 'update';
}).controller('LearnMemoryUpdateItemCtrl', function ($scope, $rootScope, $location, $localStorage, $http, $routeParams, $anchorScroll) {
    $anchorScroll();

    $rootScope.nav = false;

    $scope.login = false;

    $http.get('http://' + $localStorage.adress + '/api/' + $routeParams.id).success(function (data) {
        $scope.substance = data.substance;
        $scope.date = data.updatedAt;
        $scope.text = toMarkdown(data.content);
    });

    $('textarea').autoResize();
}).controller('LearnMemoryConfigCtrl', function ($scope, $rootScope, $location, $localStorage, $anchorScroll) {
    $anchorScroll();

    $rootScope.nav = 'config';

    $scope.adress = $localStorage.adress;

    $scope.update = function () {
        $localStorage.adress = $scope.adress;
        navigator.notification.alert('The adress has just been updated!', null, 'Done', 'Ok');
    };
});
var app = angular.module('app', ['ui.bootstrap', 'ngResource','ngRoute']);
app.config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/',{
        // templateUrl: 'index.html',
    })
    .when('/group',{
        templateUrl: 'partials/nav.html',
        controller: 'NavCtrl'
    })
    .otherwise({
        redirectTo:'/'
    })

}])

app.controller('MainCtrl', ['$scope', 'user', 'group',
    function(scope, user, group) {
        user.loadUser().then(function(data) {
            scope.user = data.user;
        });
        user.getUser().then(function(data){
            console.log(data.user);
        });
    }
]);
app.controller('NavCtrl', ['$scope', 'group',
    function(scope, group) {
        group.getGroup().then(function(data) {
            scope.groups = data.group;
        })

    }
])


app.factory('user', ['$resource',
    function($resource) {
        var User = $resource('data.js', {});
        var user = null;

        return {
            loadUser: function() {
                console.log(User.get());
                user = User.get().$promise;
                return user;
            },
            getUser: function() {
                return user;
            }
        }
    }
])
app.factory('group', ['$resource',
    function($resource) {
        var Group = $resource('data.js', {});
        var group = null;

        return {
            getGroup: function() {
                group = Group.get().$promise;
                return group;
            }
        }
    }
])

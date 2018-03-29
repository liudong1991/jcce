var mine_set_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_set', {
        url: '/mine_set',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_set/mine_set.html',
                controller: 'mine_setCtrl'
            }
        }
    });
};
myapp.config(mine_set_myConfig);

angular.module('starter.mine_set',[])
.controller('mine_setCtrl', function($scope) {
    $scope.$on('$ionicView.beforeEnter', function() {

    });
});

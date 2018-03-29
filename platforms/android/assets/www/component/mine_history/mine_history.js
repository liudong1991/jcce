var mine_history_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_history', {
        url: '/mine_history',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_history/mine_history.html',
                controller: 'mine_historyCtrl'
            }
        }
    });
};
myapp.config(mine_history_myConfig);

angular.module('starter.mine_history',[])
.controller('mine_historyCtrl', function($scope,Common) {
    $scope.$on('$ionicView.beforeEnter', function() {
		Common.post('openHistory/getList',{},function(data){
			$scope.list = data.body;
		},{},0)
    });
});

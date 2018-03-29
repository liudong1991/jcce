var mine_other_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_other', {
        url: '/mine_other',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_other/mine_other.html',
                controller: 'mine_otherCtrl'
            }
        }
    });
};
myapp.config(mine_other_myConfig);

angular.module('starter.mine_other',[])
.controller('mine_otherCtrl', function($scope,Common) {
    $scope.$on('$ionicView.beforeEnter', function() {
		Common.post('debt/getMyDebt',{},function(data){
			$scope.debt = data.body.debt;
			console.log()
			$scope.showColor = data.body.debt.toString().indexOf('-') == -1 
		},{},0)
    });
});

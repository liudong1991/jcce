var mine_setmore_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_setmore', {
        url: '/mine_setmore',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_setmore/mine_setmore.html',
                controller: 'mine_setmoreCtrl'
            }
        }
    });
};
myapp.config(mine_setmore_myConfig);

angular.module('starter.mine_setmore',[])
.controller('mine_setmoreCtrl', function($scope,Common) {
	$scope.save = function(){
		Common.post('settings/saveIntercept',$scope.user,function(data){
			Common.showAlert('','保存成功！')
		},{},0)
	}
    $scope.$on('$ionicView.beforeEnter', function() {
		Common.post('settings/getIntercept',{},function(data){
			$scope.user = data.body;
		},{},0)
    });
});

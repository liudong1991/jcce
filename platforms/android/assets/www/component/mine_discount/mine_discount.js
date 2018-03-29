var mine_discount_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_discount', {
        url: '/mine_discount',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_discount/mine_discount.html',
                controller: 'mine_discountCtrl'
            }
        }
    });
};
myapp.config(mine_discount_myConfig);

angular.module('starter.mine_discount',[])
.controller('mine_discountCtrl', function($scope,Common) {
	$scope.save = function(){
		console.log($scope.user)
		Common.post('settings/saveFeedback',$scope.user,function(data){
			Common.showAlert('','保存成功！')
		},{},0)
	}
    $scope.$on('$ionicView.beforeEnter', function() {
		Common.post('settings/getFeedback',{},function(data){
			$scope.list = data.body;
			$scope.user = {
				two : data.body.two,
				three : data.body.three,
				four : data.body.four
			}
		},{},0)
    });
});

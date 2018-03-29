var mine_dailiDetail_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_dailiDetail', {
        url: '/mine_dailiDetail/:agentId',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_dailiDetail/mine_dailiDetail.html',
                controller: 'mine_dailiDetailCtrl'
            }
        }
    });
};
myapp.config(mine_dailiDetail_myConfig);

angular.module('starter.mine_dailiDetail',[])
.controller('mine_dailiDetailCtrl', function($scope,$stateParams,Common,$timeout,$ionicScrollDelegate) {
	$scope.showName = function(){
		$scope.showTime = !$scope.showTime;
	}
	$scope.loadMore = function(){
    	$scope.can_loadmore = false;
    	Common.post('debt/getDebtList',{
    		agentId : $stateParams.agentId,
    		pageIndex : $scope.curr,
    		pageSize : 20
    	},function(data){
    		$scope.list = $scope.list.concat(data.body.list);
    		$scope.curr ++;
    		$timeout(function(){
    			$scope.can_loadmore = $scope.curr <= Math.ceil(data.body.totalCash/20);
    		},3000)
    		
    		$scope.$broadcast('scroll.infiniteScrollComplete');
    	},{},0)
    }
	//删除
	$scope.del = function(){
		var ids = [];
		for(var i in $scope.list){
			if($scope.list[i].choose) ids.push($scope.list[i].id)
		}
		if(ids.length == 0){
			Common.showAlert('','请选定！');
			return;
		}
		Common.showConfirm('','您确定要删除当前选择的序号？',function(){
            Common.post('debt/deleteDebt',{
				ids : ids
			},function(data){
				Common.showAlert('','删除成功！');
				$ionicScrollDelegate.scrollTop();
				$scope.showTime = false;
				$scope.curr = 1;
		        $scope.list = [];
		        $scope.loadMore();
			},{},0)
        },{},'确定','取消')
		
	}
    $scope.$on('$ionicView.beforeEnter', function() {
		$scope.showTime = false;
		$scope.curr = 1;
        $scope.list = [];
        $scope.loadMore();
    });
});

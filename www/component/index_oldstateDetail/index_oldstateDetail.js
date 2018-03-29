var index_oldstateDetail_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.index_oldstateDetail', {
        url: '/index_oldstateDetail/{:id,:agentIds,:beginNumberId,:endNumberId,:type}',
        views: {
            'tab-index': {
                templateUrl: 'component/index_oldstateDetail/index_oldstateDetail.html',
                controller: 'index_oldstateDetailCtrl'
            }
        }
    });
};
myapp.config(index_oldstateDetail_myConfig);

angular.module('starter.index_oldstateDetail',[])
.controller('index_oldstateDetailCtrl', function($scope,$stateParams,Common,$timeout,$ionicScrollDelegate) {
    $scope.showTimeClick = function(){
        $scope.showTime = !$scope.showTime;
    }
    //获取数据
    $scope.loadMore = function(){
    	$scope.can_loadmore = false;
    	var myText = $stateParams.id == 0 ? 'historySheet/getBettingDetail' : 'historySheet/getResultList'
    	Common.post(myText,{
    			agentIds : [$stateParams.agentIds],
    			beginNumberId : $stateParams.beginNumberId,
	        	endNumberId : $stateParams.endNumberId,
	        	type : $stateParams.type,
	    		pageIndex : $scope.curr,
	    		pageSize : 20
    	},function(data){
    		$scope.list = $scope.list.concat(data.body.list);
    		$scope.curr ++;
    		$timeout(function(){
    			$scope.can_loadmore = $scope.curr <= Math.ceil(data.body.total/20)
    		},3000)
    		$scope.$broadcast('scroll.infiniteScrollComplete');
    	},{},0)
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.showTime = false;
        $scope.id = $stateParams.id;
        $scope.title = $stateParams.id == 0 ? "历史报表详情" : '彩金表';
        $scope.curr = 1;
        $scope.list = [];
        $scope.can_loadmore = false;
      	$scope.loadMore();
      	$ionicScrollDelegate.scrollTop();
    });
});

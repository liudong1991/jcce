var index_oldstateDetailmore_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.index_oldstateDetailmore', {
        url: '/index_oldstateDetailmore/:id/:start/:end',
        views: {
            'tab-index': {
                templateUrl: 'component/index_oldstateDetailmore/index_oldstateDetailmore.html',
                controller: 'index_oldstateDetailmoreCtrl'
            }
        }
    });
};
myapp.config(index_oldstateDetailmore_myConfig);

angular.module('starter.index_oldstateDetailmore',[])
.controller('index_oldstateDetailmoreCtrl', function($scope,$stateParams,Common,$timeout,$ionicScrollDelegate,$state) {
    $scope.changeClick = function(_num){
        $scope.type = _num;
        $scope.curr = 1;
        $scope.list = [];
        $scope.can_loadmore = false;
      	$scope.loadMore();
        $ionicScrollDelegate.scrollTop();
    }
    //进入详情
    $scope.gotoDetail = function(_num,_id){
//  	ui-sref="tab.index_oldstateDetail({id:'0',agentIds:item.total.agentId,beginNumberId:user.startTime,endNumberId:user.endTime,type:type})"
		$state.go('tab.index_oldstateDetail',{
			id:_num,
			agentIds:_id,
			beginNumberId:$stateParams.start,
			endNumberId:$stateParams.end,
			type:$scope.type
		})
    }
    //获取二级列表
    $scope.loadMore = function(){
    	$scope.can_loadmore = false;
    	Common.post('historySheet/getList',{
    			agentId : $stateParams.id,
    			beginNumberId : $stateParams.start,
	        	endNumberId : $stateParams.end,
	        	type : $scope.type,
	    		pageIndex : $scope.curr,
	    		pageSize : 100
    	},function(data){
    		$scope.list = $scope.list.concat(data.body.list);
    		$scope.allList = data.body.summary;
    		$scope.curr ++;
    		$timeout(function(){
    			$scope.can_loadmore = $scope.curr <= Math.ceil(data.body.total/100)
    		},3000)
    		
    		$scope.$broadcast('scroll.infiniteScrollComplete');
    	},{},0)
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.type = 1;
        $scope.curr = 1;
        $scope.list = [];
        $scope.can_loadmore = false;
      	$scope.loadMore();
      	$ionicScrollDelegate.scrollTop();
    });
});

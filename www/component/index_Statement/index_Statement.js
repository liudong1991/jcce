var index_Statement_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.index_Statement', {
        url: '/index_Statement/:id/:type',
        views: {
            'tab-index': {
                templateUrl: 'component/index_Statement/index_Statement.html',
                controller: 'index_StatementCtrl'
            }
        }
    });
};
myapp.config(index_Statement_myConfig);

angular.module('starter.index_Statement',[])
.controller('index_StatementCtrl', function($scope,$stateParams,Common,$timeout,$state) {
	$scope.gotoDetail = function(_boo,_agentId){
		$state.go('tab.index_statementdetail',{
			isSelf:_boo ? 0 : 1,
			id : $stateParams.id,
			agentId : _agentId,
			type : $stateParams.type
		})
	}
	$scope.loadMore = function(){
    	$scope.can_loadmore = false;
    	Common.post('sheet/getAgentListByNumber',{
    		numberId : $stateParams.id,
    		type : $stateParams.type,
    		agentId : -1,
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
		$scope.curr = 1;
        $scope.list = [];
        $scope.loadMore();
    });
});

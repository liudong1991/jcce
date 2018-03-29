var index_baobiao_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.index_baobiao', {
        url: '/index_baobiao',
        views: {
            'tab-index': {
                templateUrl: 'component/index_baobiao/index_baobiao.html',
                controller: 'index_baobiaoCtrl'
            }
        }
    });
};
myapp.config(index_baobiao_myConfig);

angular.module('starter.index_baobiao',[])
.controller('index_baobiaoCtrl', function($scope,Common,$timeout,$ionicScrollDelegate) {
    $scope.changeClick = function(_num){
        $scope.type = _num;
        $scope.curr = 1;
        $scope.list = [];
        $scope.can_loadmore = false;
      	$scope.loadMore();
        $ionicScrollDelegate.scrollTop();
    }
    $scope.loadMore = function(){
    	$scope.can_loadmore = false;
    	Common.post('sheet/getList',{
    		type : $scope.type,
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
        $scope.type = 1;
        $scope.curr = 1;
        $scope.list = [];
        $scope.loadMore();
    });
});

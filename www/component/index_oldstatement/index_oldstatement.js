var index_oldstatement_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.index_oldstatement', {
        url: '/index_oldstatement',
        views: {
            'tab-index': {
                templateUrl: 'component/index_oldstatement/index_oldstatement.html',
                controller: 'index_oldstatementCtrl'
            }
        }
    });
};
myapp.config(index_oldstatement_myConfig);

angular.module('starter.index_oldstatement',[])
.controller('index_oldstatementCtrl', function($scope,Common,$ionicScrollDelegate,$timeout) {
    $scope.showFirst = true;
    $scope.list = [];
    $scope.submitClick = function(){
        $scope.showFirst = false;
        $scope.loadMore();
    }

    $scope.changeClick = function(_num){
        $scope.type = _num;
        $scope.curr = 1;
        $scope.list = [];
        $scope.can_loadmore = false;
      	$scope.loadMore();
        $ionicScrollDelegate.scrollTop();
    }
    //获取一级列表
    $scope.loadMore = function(){
    	$scope.can_loadmore = false;
    	Common.post('historySheet/getFirstList',{
    		beginNumberId : $scope.user.startTime,
        	endNumberId : $scope.user.endTime,
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

    $scope.showTimeClick = function(){
        $scope.showTime = !$scope.showTime;
    }
    //返回
    $scope.gotoBack = function(){
        if(!$scope.showFirst) {
            $scope.user = {
                startTime : $scope.numberList[0].numberId,
                endTime : $scope.numberList[0].numberId
            }
            $scope.showFirst = true;
            return;
        }
        window.history.back();
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.showTime = false;
        $scope.type = 1;
        $scope.curr = 1;
        
        $scope.user = {
            startTime : '',
            endTime : ''
        }
        //获取期号
        Common.post('historySheet/getNumberList',{},function(data){
        	$scope.numberList = data.body;
        	$scope.user = {
	            startTime : data.body[0].numberId,
	            endTime : data.body[0].numberId
	        }
        	console.log($scope.user)
        })
    });
});

var index_statementdetail_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.index_statementdetail', {
        url: '/index_statementdetail/{:isSelf,:id,:agentId,:type}',
        views: {
            'tab-index': {
                templateUrl: 'component/index_statementdetail/index_statementdetail.html',
                controller: 'index_statementdetailCtrl'
            }
        }
    });
};
myapp.config(index_statementdetail_myConfig);

angular.module('starter.index_statementdetail',[])
.controller('index_statementdetailCtrl', function($scope,$stateParams,Common,$timeout) {
    $scope.showTimeClick = function(){
        $scope.showTime = !$scope.showTime;
    }
    $scope.getNumber = function(){
    	$scope.allArr = [];
    	var num = 0;
    	for(var i in $scope.list){
    		var newAll = [];
    		for(var l in $scope.list[i].group.dataList){
    			num ++;
    			newAll.push(num)
    		}
    		$scope.allArr.push(newAll)
    	}
    }
    $scope.showMess = function(_index){
        if($scope.type == 1) return;
        Common.showAlert('组合条件',$scope.list[_index].group.rule)
    }
    //全选
    $scope.chooseAll = function(){
    	for(var i in $scope.list){
    		for(var l in $scope.list[i].group.dataList){
    			if($scope.show.allChoose) $scope.list[i].group.dataList[l].choose = true;
    			else $scope.list[i].group.dataList[l].choose = false;
    		}
    	}
    }
    //撤单
    $scope.reset = function(){
    	var newArr = [];
    	for(var i in $scope.list){
    		for(var l in $scope.list[i].group.dataList){
    			if($scope.list[i].group.dataList[l].choose) newArr.push($scope.list[i].group.dataList[l].id);
    		}
    	}
    	if(newArr.length == 0){
    		Common.showAlert('','请选择撤单号码！')
    		return;
    	}
    	Common.post('order/cancelOrder',{
    		ids: newArr.join(',')
    	},function(data){
    		$scope.curr = 0;
    		$scope.list = [];
    		$scope.loadMore();
    	},{},0)
    }
    $scope.loadMore = function(){
    	$scope.can_loadmore = false;
    	Common.post('sheet/getBettingDetail',{
    		numberId : $stateParams.id,
    		agentId : $stateParams.agentId,
    		type : $stateParams.type,
    		pageIndex : $scope.curr,
    		pageSize : 20
    	},function(data){
    		$scope.list = $scope.list.concat(data.body.list);
    		$scope.getNumber();
    		$scope.curr ++;
    		$timeout(function(){
    			$scope.can_loadmore = $scope.curr <= Math.ceil(data.body.total/20)
    		},3000)
    		
    		$scope.$broadcast('scroll.infiniteScrollComplete');
    	},{},0)
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.showTime = false;
        $scope.type = $stateParams.isSelf;
        $scope.curr = 1;
        $scope.list = [];
        $scope.loadMore();
        $scope.show = {
        	allChoose : false
        }
        $scope.numberId = $stateParams.id;
    });
});

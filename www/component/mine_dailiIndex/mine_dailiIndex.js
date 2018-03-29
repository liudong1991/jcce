var mine_dailiIndex_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_dailiIndex', {
        url: '/mine_dailiIndex',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_dailiIndex/mine_dailiIndex.html',
                controller: 'mine_dailiIndexCtrl'
            }
        }
    });
};
myapp.config(mine_dailiIndex_myConfig);

angular.module('starter.mine_dailiIndex',[])
.controller('mine_dailiIndexCtrl', function($scope,Common,$state) {
	$scope.showTime = false;
	$scope.showName = function(){
		$scope.showTime = !$scope.showTime;
	}
	$scope.submit = function(){
		if($scope.user.account == '' && $scope.user.name == ''){
			Common.showAlert('','请输入查询条件！')
			return;
		}
		$scope.getList();
	}
	$scope.getList = function(){
		Common.post('debt/getAgentList',{
			account : $scope.user.account,
			name : $scope.user.name,
			state : -1
		},function(data){
			$scope.list = data.body;
		})
	}
	
	//全选
	$scope.chooseAll = function(){
		for(var i in $scope.list.list){
			$scope.list.list[i].choose = $scope.user.choose;
		}
	}
	//清除
	$scope.clear = function(){
		var agentIds = [];
		for(var i in $scope.list.list){
			if($scope.list.list[i].choose) agentIds.push($scope.list.list[i].agentId);
		}
		if(agentIds.length == 0){
			Common.showAlert('','请选定！');
			return;
		}
		Common.showConfirm('','您确定要对选择的账号进行清零？',function(){
            Common.post('debt/clearAgentDebt',{
				agentIds : agentIds
			},function(data){
				Common.showAlert('','清零成功！',function(){
					$scope.getList();
				})
			},{},0)
        },{},'确定','取消')
		
	}
	//进入设置
	$scope.gotoSet = function(_num){
		Common.setCache('dailiSet',$scope.list.list[_num]);
		$state.go('tab.mine_dailiSet')
	}
	//进入录入
	$scope.gotoInput = function(_num){
		Common.setCache('dailiSet',$scope.list.list[_num]);
		$state.go('tab.mine_dailiInput')
	}
    $scope.$on('$ionicView.beforeEnter', function() {
		$scope.user = {
			account : '',
			name : ''
		}
		$scope.getList();
    });
});

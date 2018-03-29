var mine_dailiSet_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_dailiSet', {
        url: '/mine_dailiSet',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_dailiSet/mine_dailiSet.html',
                controller: 'mine_dailiSetCtrl'
            }
        }
    });
};
myapp.config(mine_dailiSet_myConfig);

angular.module('starter.mine_dailiSet',[])
.controller('mine_dailiSetCtrl', function($scope,Common) {
	//更改状态
	$scope.changeState = function(){
		if($scope.message.debtState == 0 && $scope.user.maxDebt<0){
			Common.showAlert('','待结帐金额必须大于0！')
			return;
		}
		var textmess = $scope.message.debtState == 0 ? '确定启用？' :'确定停用？';
		Common.showConfirm('',textmess,function(){
			Common.post('debt/setDebtState',{
				agentId : $scope.message.agentId,
				state : $scope.message.debtState == 0 ? 1 :0
			},function(data){
				$scope.message.debtState = $scope.message.debtState == 0 ? 1 :0;
			})
		})
	}
	//保存
	$scope.save = function(){
		if($scope.user.maxDebt == '' || $scope.user.maxDebt == undefined){
			Common.showAlert('','请输入待结账金额！')
			return;
		}
		Common.post('debt/saveMaxDebt',{
			agentId : $scope.message.agentId,
			cash : $scope.user.maxDebt*1000
		},function(data){
			Common.showAlert('','保存成功！');
		},{},0)
	}
    $scope.$on('$ionicView.beforeEnter', function() {
		$scope.message = Common.getCache('dailiSet');
		$scope.user={
			maxDebt : $scope.message.maxDebt/1000
		}
    });
});

var mine_dailiInput_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_dailiInput', {
        url: '/mine_dailiInput',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_dailiInput/mine_dailiInput.html',
                controller: 'mine_dailiInputCtrl'
            }
        }
    });
};
myapp.config(mine_dailiInput_myConfig);

angular.module('starter.mine_dailiInput',[])
.controller('mine_dailiInputCtrl', function($scope,Common,$interval) {
	$scope.changeType = function(_type){
		$scope.type = _type;
		$scope.user.money = ''
	}
	$scope.numClick = function(_num){
    	if(_num == '<' && $scope.user.money == '') return;
        if(_num == '.' && $scope.user.money == ''){
            $scope.user.money = '0.';
        }else if(_num == '.' && $scope.user.money.indexOf('.') != -1){
            return;
        }
        else if(_num == '<' && $scope.user.money != ''){
            $scope.user.money = $scope.user.money.substring(0,$scope.user.money.length -1);
        }
        else if($scope.user.money.split('.').length == 2 && $scope.user.money.split('.')[1].length == 2){
            return;
        }else{
            $scope.user.money = $scope.user.money+_num;
        }
    }
	//保存
	$scope.submitClick = function(){
		if($scope.user.money == '' || $scope.user.money == undefined){
			Common.showAlert('','请输入金额！')
			return;
		}
		if($scope.type == 1 && $scope.user.money> Math.abs($scope.message.cash)){
			Common.showAlert('','代理收款不可大于代理待结帐额！')
			return;
		}
		Common.showConfirm('','<p class="tc">您确定要保存？</p>',function(){
            Common.post('debt/saveRecord',{
				agentId : $scope.message.agentId,
				type : $scope.type,
				cash : $scope.user.money*1000
			},function(data){
				Common.showAlert('','保存成功！')
			},{},0)
        },{},'确定','取消')
		
	}
    $scope.$on('$ionicView.beforeEnter', function() {
    	$scope.type = 2;
    	$scope.bgfoucs = false;
		$scope.message = Common.getCache('dailiSet');
		$scope.user = {
			money : ''
		}
		$scope.newTime = $interval(function(){
            $scope.bgfoucs = !$scope.bgfoucs;
        },1000)
    });
    $scope.$on('$ionicView.beforeLeave', function() {
        $interval.cancel($scope.newTime);
        
    });
});

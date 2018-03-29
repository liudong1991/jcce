var table_submit_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.table_submit', {
        url: '/table_submit',
        views: {
            'tab-table': {
                templateUrl: 'component/table_submit/table_submit.html',
                controller: 'table_submitCtrl'
            }
        }
    });
};
myapp.config(table_submit_myConfig);

angular.module('starter.table_submit',[])
.controller('table_submitCtrl', function($scope,Common,$state,$interval) {
    
    $scope.numClick = function(_num){
        if(($scope.user.money.length >= 8 && _num != '<')|| ($scope.user.money == '' &&  _num == '<')) return;
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
    $scope.goback = function(){
        window.history.back()
    }
    $scope.submitClick = function(){
        if($scope.user.money == ''){
            Common.showAlert('','请输入下注金额！')
            return;
        }
        Common.post('order/orderNow',{
        	data : angular.toJson($scope.myDate.list),
        	rule : ''
        },function(data){
        	Common.showConfirm('','下注成功！',function(){
	            $state.go('tab.index_baobiao')
	        },function(){
	            window.history.back()
	        },'查看报表','返回')
        })
        
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.title = "7025期";
        $scope.bgfoucs = true;
        $scope.newTime = $interval(function(){
            $scope.bgfoucs = !$scope.bgfoucs;
        },700)
        $scope.myDate = Common.getCache('table_date');
        $scope.user = {
            money : ''
        }
    });

    $scope.$on('$ionicView.beforeLeave', function() {
        $interval.cancel($scope.newTime);
    });
});

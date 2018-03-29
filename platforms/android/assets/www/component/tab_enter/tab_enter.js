var tab_enter_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.tab_enter', {
        url: '/tab_enter',
        views: {
            'tab-enter': {
                templateUrl: 'component/tab_enter/tab_enter.html',
                controller: 'tab_enterCtrl'
            }
        }
    });
};
myapp.config(tab_enter_myConfig);

angular.module('starter.tab_enter',[])
.controller('tab_enterCtrl', function($scope,$interval,Common,$ionicScrollDelegate) {
    //输入框选择
    $scope.focusClick = function(_num){
        $scope.inputType = _num;
    }
    //选择框
    $scope.checkboxClick = function(){
        for(i in $scope.enterDate){
            $scope.enterDate[i].checkbox = $scope.user.allcheckout;
        }
    }
    //清空
    $scope.clearAll = function(){
    	var newArr = []
    	for(i in $scope.enterDate){
            if($scope.enterDate[i].checkbox) newArr.push($scope.enterDate[i].id)
        }
    	if(newArr.length == 0){
    		Common.showAlert('','请选定！');
    		return;
    	}
        Common.post('order/clearOrder',{
        	ids:newArr
        },function(data){
        	$scope.getOrderList();
        },{},0)
    }
    //撤单
    $scope.withdrawal = function(){
        var myArr = []
        for(i in $scope.enterDate){
            if($scope.enterDate[i].checkbox) myArr.push($scope.enterDate[i].id)
        }
        if(myArr.length == 0) Common.showAlert('','请选定！');
        else{
            Common.showConfirm('','确定要撤单？',function(){
                //撤单操作
                Common.post('order/cancelOrder',{
		        	ids:myArr
		        },function(data){
		        	$scope.getOrderList();
		        	Common.showAlert('','撤单成功！')
		        },{},0)
            },function(){

            },'确定','返回')
        }
    }
    $scope.numClick = function(_num){
        if($scope.inputType == 0){
            if(($scope.user.number.length == 4&&_num != '<') || _num == '.') return;
            if(_num == '<' && $scope.user.number == '') return;
            if(_num == '<' && $scope.user.number != ''){
                $scope.user.number = $scope.user.number.substring(0,$scope.user.number.length -1);
            }
            else{
                $scope.user.number = $scope.user.number+_num;
                if($scope.user.number.length == 4){
                    $scope.inputType = 1;
                    //加载赔率
                    Common.post('order/getPrepareBuySingleData',{
                    	no : $scope.user.number
                    },function(data){
                    	$scope.prepareBuySingleData = data.body;
                    })
                }
            }
        }else{
        	if(_num == '<' && $scope.user.money == '') return;
            if($scope.hasSubmit&&_num != 'X'&&_num != '.' &&_num != '<'){
                $scope.user.money = _num.toString();
                $scope.hasSubmit = false;
                return;
            }
            if($scope.user.money.length >= 5 || _num == 'X') return;
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
        
    }
    $scope.submitClick = function(){
        if($scope.user.number.length != 4 || ($scope.user.number.indexOf('X')!= -1 && $scope.user.number.match(/X/g).length == 4)){
            Common.showAlert('','号码格式不符！');
            $scope.inputType = 0;
            return
        }
        if($scope.user.money == ''){
            Common.showAlert('','请输入下注金额！');
            return
        }
        if($scope.user.money > $scope.prepareBuySingleData.cash/1000){
            Common.showAlert('','可下注金额不足！');
            return
        }
        Common.post('order/singleOrderNow',{
        	no : $scope.user.number,
        	odds : $scope.prepareBuySingleData.odds,
        	cash : $scope.user.money*1000
        },function(data){
        	var newDate = {
	            id:data.body.id,
	            no:data.body.no,
	            cash:data.body.cash,
	            odds:data.body.odds,
	            checkbox : false
	        }
	        $scope.enterDate.push(newDate);
	        $scope.inputType = 0;
	        $scope.user.number = '';
	        $scope.hasSubmit = true;
	        $ionicScrollDelegate.scrollBottom(true);
        })
        
    }
    $scope.getOrderList = function(){
    	Common.post('order/getList',{},function(data){
        	$scope.orderList = data.body;
        	$scope.enterDate = data.body.list;
        	$ionicScrollDelegate.scrollBottom(true);
        	$scope.newTime = $interval(function(){
	            $scope.bgfoucs = !$scope.bgfoucs;
	            if($scope.orderList.countdown > 0) $scope.orderList.countdown-=1000;
	        },1000)
        	if(data.body.list.length > 30){
        		Common.showAlert('','当前注单条数稍多了，请点“清空”再继续，操作会更快！')
        	}
        },{},0)
    }
    $scope.$on('$ionicView.beforeEnter', function() {
//      $scope.enterDate = Common.getCache('enterDate') || [];
        $scope.bgfoucs = false;
        $scope.inputType = 0;
        $scope.user = {
            number:'',
            money:'',
            allcheckout:false
        }
        $scope.getOrderList();
    });
    $scope.$on('$ionicView.beforeLeave', function() {
        $interval.cancel($scope.newTime);
        
    });
});

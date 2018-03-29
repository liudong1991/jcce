var mine_Printing_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_Printing', {
        url: '/mine_Printing',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_Printing/mine_Printing.html',
                controller: 'mine_PrintingCtrl'
            }
        }
    });
};
myapp.config(mine_Printing_myConfig);

angular.module('starter.mine_Printing',[])
.controller('mine_PrintingCtrl', function($scope,Common,cordovaPlug) {
	//清空号码
	$scope.cancel = function(){
		var newArr = [];
		for(var i in $scope.list.list){
			newArr.push($scope.list.list[i].id);
		}
		if(newArr.length == 0) return;
		Common.post('order/cancelOrder',{
			ids:newArr.join(',')
		},function(data){
			Common.showAlert('','号码已经清空！')
		},{},0)
	}
	//截屏
	$scope.screen = function(){
//		alert(document.getElementById("cjc_top").offsetTop)
		cordovaPlug.CommonPL(function() {
			Common.showAlert('','截屏成功！');
		}, "clipScreen", [document.getElementById("cjc_top").offsetTop])
	}
	//打印
	$scope.daying = function(){
		var myObj = {
			"title" : $scope.list.game+$scope.list.number+'期【'+$scope.list.openTime+'】',
			"date" : $scope.list.openTime,
			"total" : $scope.list.totalCash,
			"time" : $scope.list.currentTime,
			"list" : []
		}
		for(var i in $scope.list.list){
			var newObj = {
				"serial" : $scope.list.list.length - i,
				"code" : $scope.list.list[i].no,
				"money": $scope.list.list[i].cash,
				"odds": $scope.list.list[i].odds
			}
			myObj.list.push(newObj)
		}
		cordovaPlug.CommonPL(function() {
			
		}, "btPrint", [myObj])
		console.log(myObj.list)
	}
    $scope.$on('$ionicView.beforeEnter', function() {
		Common.post('order/getList',{},function(data){
			$scope.list = data.body;
		},{},0)
    });
});

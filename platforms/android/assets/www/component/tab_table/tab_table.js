var tab_table_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.tab_table', {
        url: '/tab_table',
        views: {
            'tab-table': {
                templateUrl: 'component/tab_table/tab_table.html',
                controller: 'tab_tableCtrl'
            }
        }
    });
};
myapp.config(tab_table_myConfig);

angular.module('starter.tab_table',[])
.controller('tab_tableCtrl', function($scope,Common,$state) {
    

    $scope.itemClick = function(_num){
        if($scope.data[_num].check){
            $scope.data[_num].check = false;
        }
        else{
          $scope.data[_num].check = true;
        }  
    }
    $scope.changeClick = function(_num,_string){
        $scope.type =_num;
        $scope.typeString = _string;
        $scope.getList();
    }
    $scope.reload = function(){
    	$scope.getList();
    }
    $scope.submitClick = function(){
        
        var newDate = []
        for(var i = 0 ;i < $scope.data.length ; i++){
            if($scope.data[i].check) newDate.push($scope.data[i].no)
        }
        if(newDate.length == 0){
            Common.showAlert('','请选定！');
            return;
        }
        Common.post('order/getPrepareFormData',{
        	no : newDate.join(',')
        },function(data){
        	Common.setCache('table_date',data.body);
        	$state.go('tab.table_submit')
        })
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.type = 2;
        $scope.typeString = 'oxxo'
        $scope.getList = function(){
        	Common.post('order/getPrepareBuyFormData',{
        		type : $scope.typeString
        	},function(data){
	        	$scope.data = data.body;
	        },{},0)
        }
        $scope.getList();
    });
});

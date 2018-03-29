var index_agency_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.index_agency', {
        url: '/index_agency/:id',
        views: {
            'tab-index': {
                templateUrl: 'component/index_agency/index_agency.html',
                controller: 'index_agencyCtrl'
            }
        }
    });
};
myapp.config(index_agency_myConfig);

angular.module('starter.index_agency',[])
.controller('index_agencyCtrl', function($scope,$stateParams,$state,Common) {
    $scope.gotoAdd = function(){

        if($scope.type != 0) return;
        $state.go('tab.index_addagency',{id:'0'})
    }
    $scope.getList = function(){
    	Common.post('agent/gettList',{
        	agentId : $stateParams.id == 0 ? -1 : $stateParams.id,
        	account : $scope.user.account,
        	name : $scope.user.name
        },function(data){
        	$scope.list = data.body;
        },{},0)
    }
    $scope.submit = function(){
    	if($scope.user.name == '' && $scope.user.account == ''){
    		Common.showAlert('','请输入查询条件！')
    		return;
    	}
    	$scope.getList();
    }
    $scope.setStatus = function(_id,_state,_index){
    	var myText = _state == 1 ? '确定停用？' : '确定启用？';
    	Common.showConfirm('',myText,function(){
    		Common.post('agent/setState',{
	    		id : _id,
	    		state : _state == 1 ? 2 : 1
	    	},function(data){
	    		$scope.list[_index].state = _state == 1 ? 2 : 1;
	    	},{},0)
    	})
    	
    }
    //进入下级
    $scope.gotoDetail = function(_id,_num){
    	if(_num == 0) return;
    	$state.go('tab.index_agency',{
    		id:_id
    	})
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.type = $stateParams.id;
        $scope.addText = $stateParams.id == 0 ? '新增' : '';
        $scope.user = {
        	name : '',
        	account : ''
        }
        $scope.getList();
    });
});

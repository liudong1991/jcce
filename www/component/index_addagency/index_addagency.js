var index_addagency_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.index_addagency', {
        url: '/index_addagency/:id',
        views: {
            'tab-index': {
                templateUrl: 'component/index_addagency/index_addagency.html',
                controller: 'index_addagencyCtrl'
            }
        }
    });
};
myapp.config(index_addagency_myConfig);

angular.module('starter.index_addagency',[])
.controller('index_addagencyCtrl', function($scope,$stateParams,Common) {
    $scope.checkout = function(){
    	if($scope.user.account == ''){
    		Common.showAlert('','名称不能为空！');
    		return;
    	}
    	Common.post('agent/checkAccount',{
    		account : $scope.user.account
    	},function(data){
    		if(data.body.exist) Common.showAlert('','此帐号已被占用！');
    		else Common.showAlert('','此帐号可用！');
    	},{},0)
    }
    //获取操作详情
    $scope.getList = function(){
    	Common.post('agent/detail',{
    		id : $stateParams.id
    	},function(data){
    		$scope.user = data.body;
    		$scope.user = {
    			account : data.body.account,
    			name: data.body.name,
				passwd: data.body.passwd,
				credit: data.body.credit,
				profitTwo: data.body.profitTwo.toString(),
				profitThree: data.body.profitThree.toString(),
				profitFour: data.body.profitFour.toString(),
				interceptTwo: data.body.interceptTwo.toString(),
				interceptThree: data.body.interceptThree.toString(),
				interceptFour: data.body.interceptFour.toString(),
				createTime : data.body.createTime
	        }
    		console.log($scope.user)
    		$scope.passwd = data.body.passwd;
    	},{},0)
    }
    //保存
    $scope.checkPass = function(_input){
	    var regx =/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
	    var regx1 =/([a-zA-Z]+?)/g;
	    if(_input.match(regx)!=null&&_input.match(regx1)!=null &&_input.match(regx1).length >1) return true;
	    else return false;
	}
    $scope.save = function(){
    	var newTip = $scope.user.account == '' && '账号不能为空，新增不成功！' 
//	    			|| $scope.user.account.length != 4 && '账号必须为4个字符，新增不成功！'
	                || $scope.user.name == '' && '名称不能为空，新增不成功！'
	                || $scope.user.passwd == '' && '密码不能为空，新增不成功！'
	                || !$scope.checkPass($scope.user.passwd) && '密码至少为6个字符，并至少包含两个字母。修改失败！'
	                || $scope.user.credit == '' && '信用额度不能为空，新增不成功！'
	                || ! /^[0-9]+$/.test($scope.user.credit) && '信用额度只能是数字，新增不成功！'
	                || ''
	    if(newTip != ''){
	      Common.showAlert('',newTip,0)
	      return;
	    }
    	var postUrl = $stateParams.id == 0 ? 'agent/add' : 'agent/modify';
    	if($scope.passwd != $scope.user.passwd) $scope.user.passwd = Common.checkMd5($scope.user.passwd);
    	Common.post(postUrl,$scope.user,function(data){
    		Common.showAlert('','保存成功！');
    	},{},0)
    }
    //密码
    $scope.getFoucs = function(){
    	if($scope.passwd == $scope.user.passwd) $scope.user.passwd = '';
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.type = $stateParams.id;
        $scope.title = $stateParams.id == 0 ? '新增代理' : '代理详情';
        
        Common.post('agent/getInitData',{},function(data){
        	$scope.initData = data.body;
        	$scope.user = {
	        	account: "",
				name: "",
				passwd: "",
				credit: "",
				profitTwo: data.body.prifitList[0],
				profitThree: data.body.prifitList[0],
				profitFour: data.body.prifitList[0],
				interceptTwo: data.body.interceptList[0],
				interceptThree: data.body.interceptList[0],
				interceptFour: data.body.interceptList[0],
	        }
        	if($stateParams.id != 0) $scope.getList();
        },{},0)
    });
});

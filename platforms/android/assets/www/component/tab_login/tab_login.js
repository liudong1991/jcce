var tab_login_myConfig = function($stateProvider) {
	$stateProvider
		.state('tab.tab_login', {
			url: '/tab_login',
			hideTab: true,
			views: {
				'tab-index': {
					templateUrl: 'component/tab_login/tab_login.html',
					controller: 'tab_loginCtrl'
				}
			}
		});
};
myapp.config(tab_login_myConfig);

angular.module('starter.tab_login', [])
	.controller('tab_loginCtrl', function($scope, $state, $stateParams, Common, toast, cordovaPlug, $timeout, $rootScope) {
		$scope.gotoLogin = function() {
			$scope.checkPass = function(_input) {
				var regx = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
				var regx1 = /([a-zA-Z]+?)/g;
				if(_input.match(regx) != null && _input.match(regx1) != null && _input.match(regx1).length > 1) return true;
				else return false;
			}
			var newTip = $scope.user.name == '' && '请输入账号' ||
				$scope.user.password == '' && '请输入密码' ||
				$scope.user.code == '' && '请输入验证码' ||
				!$scope.checkPass($scope.user.password) && '密码至少为6个字符，并至少包含两个字母。登陆失败！' ||
				''
			if(newTip != '') {
				Common.showAlert('', newTip)
				return;
			}
			Common.post('interfaces/home/user/login', {
				account: $scope.user.name,
				passwd: Common.checkMd5($scope.user.password),
				key: $scope.key,
				code: $scope.user.code
			}, function(data) {
				$rootScope.token = data.body;
				data.body.url = 'interfaces/agentPhone/';
				$state.go('tab.tab_index');
				$rootScope.webname = data.body.site;
				Common.setCache('Token', data.body,86400000);
			})
		}
		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.user = {
				name: '',
				password: '',
				code: ''
			}
			Common.post('interfaces/home/index/authCodeKey', {}, function(data) {
				$scope.key = data.body.key;
				Common.post('interfaces/home/index/authCodeImg', {
					key: $scope.key,
					width: '100',
					height: '30'
				}, function(data) {})
			})

		});
	});
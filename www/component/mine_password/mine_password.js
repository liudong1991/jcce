var mine_password_myConfig = function($stateProvider) {
	$stateProvider
		.state('tab.mine_password', {
			url: '/mine_password',
			views: {
				'tab-mine': {
					templateUrl: 'component/mine_password/mine_password.html',
					controller: 'mine_passwordCtrl'
				}
			}
		});
};
myapp.config(mine_password_myConfig);

angular.module('starter.mine_password', [])
	.controller('mine_passwordCtrl', function($scope,$state,Common) {
		$scope.user = {
			oldPass: '',
			newPass: '',
			againPass: ''
		}
		$scope.checkPass = function(_input) {
			var regx = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
			var regx1 = /([a-zA-Z]+?)/g;
			if(_input.match(regx) != null && _input.match(regx1) != null && _input.match(regx1).length > 1) return true;
			else return false;
		}
		$scope.submit = function() {
			var newTip = $scope.user.oldPass == '' && '请输入原密码' ||
				$scope.user.newPass == '' && '请输入新密码' ||
				$scope.user.againPass == '' && '请再次输入密码' ||
				(!$scope.checkPass($scope.user.oldPass) || !$scope.checkPass($scope.user.newPass) || !$scope.checkPass($scope.user.againPass)) && '密码至少为6个字符，并至少包含两个字母。修改失败！' ||
				$scope.user.oldPass == $scope.user.newPass && '新密码不可与原密码相同，修改失败！' ||
				$scope.user.newPass != $scope.user.againPass && '新旧密码不一致，修改失败！' ||
				''
			if(newTip != '') {
				Common.showAlert('', newTip)
				return;
			}
			Common.post('myInfo/modifyPwd', {
				oldPwd: hex_md5($scope.user.oldPass),
				newPwd: hex_md5($scope.user.newPass)
			}, function(data) {
				Common.showAlert('', '密码修改成功！',function(){
					$state.go('tab.tab_mine')
				})
			})

		}
		$scope.$on('$ionicView.beforeEnter', function() {

		});
	});
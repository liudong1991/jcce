var option_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.option', {
        url: '/option',
        views: {
            'tab-index': {
                templateUrl: 'component/option/option.html',
                controller: 'optionCtrl'
            }
        }
    });
};
myapp.config(option_myConfig);

angular.module('starter.option',[])
.controller('optionCtrl', function($scope,Common,$state) {
    $scope.$on('$ionicView.beforeEnter', function() {
		Common.clearCache('Token')
		Common.post('interfaces/home/index/getServers',{},function(data){
			$scope.List = data.body;
		},{})
	  $scope.gotoLogin = function(_url){
		Common.setUrl(_url);
	  	$state.go('tab.tab_login')
	  }
    });
});

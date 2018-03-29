var tab_index_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.tab_index', {
        url: '/tab_index',
        views: {
            'tab-index': {
                templateUrl: 'component/tab_index/tab_index.html',
                controller: 'tab_indexCtrl'
            }
        }
    });
};
myapp.config(tab_index_myConfig);

angular.module('starter.tab_index',[])
.controller('tab_indexCtrl', function($scope,Common,$rootScope) {
    $scope.$on('$ionicView.beforeEnter', function() {
    	console.log($rootScope.webname)
		Common.post('home/getNewNotice',{},function(data){
			$scope.NewNotice = data.body;
		})
    });
});

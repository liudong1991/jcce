var mine_message_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_message', {
        url: '/mine_message',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_message/mine_message.html',
                controller: 'mine_messageCtrl'
            }
        }
    });
};
myapp.config(mine_message_myConfig);

angular.module('starter.mine_message',[])
.controller('mine_messageCtrl', function($scope,Common) {
    $scope.$on('$ionicView.beforeEnter', function() {
		Common.post('myInfo/getInfo',{},function(data){
			$scope.list = data.body;
		},{},0)
    });
});

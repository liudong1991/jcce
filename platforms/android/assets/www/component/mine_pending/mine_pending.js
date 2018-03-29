var mine_pending_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.mine_pending', {
        url: '/mine_pending',
        views: {
            'tab-mine': {
                templateUrl: 'component/mine_pending/mine_pending.html',
                controller: 'mine_pendingCtrl'
            }
        }
    });
};
myapp.config(mine_pending_myConfig);

angular.module('starter.mine_pending',[])
.controller('mine_pendingCtrl', function($scope,Common) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.showTime = false;
        Common.post('debt/getMyDebtList',{},function(data){
        	$scope.list = data.body;
        },{},0)
    });
});

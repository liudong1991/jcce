var index_withdrawalDetail_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.index_withdrawalDetail', {
        url: '/index_withdrawalDetail/:id',
        views: {
            'tab-index': {
                templateUrl: 'component/index_withdrawalDetail/index_withdrawalDetail.html',
                controller: 'index_withdrawalDetailCtrl'
            }
        }
    });
};
myapp.config(index_withdrawalDetail_myConfig);

angular.module('starter.index_withdrawalDetail',[])
.controller('index_withdrawalDetailCtrl', function($scope,$stateParams,Common) {
    $scope.showTimeClick = function(){
        $scope.showTime = !$scope.showTime;
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.showTime = false;
        Common.post('sheet/getCancelOrderList',{
        	numberId : $stateParams.id
        },function(data){
        	$scope.list = data.body;
        },{},0)
    });
});

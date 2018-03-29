var tab_mine_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.tab_mine', {
        url: '/tab_mine',
        views: {
            'tab-mine': {
                templateUrl: 'component/tab_mine/tab_mine.html',
                controller: 'tab_mineCtrl'
            }
        }
    });
};
myapp.config(tab_mine_myConfig);

angular.module('starter.tab_mine',[])
.controller('tab_mineCtrl', function($scope,cordovaPlug,Common,$state) {
    $scope.gotoLogout = function(){
        Common.showConfirm('退出提醒','您是否要退出当前账户？',function(){
            Common.post('myInfo/logout',{},function(data){
                Common.clearCache('Token')
                $state.go("tab.option");
            },{})
        },{},'确定','取消')
        
    }
    $scope.$on('$ionicView.beforeEnter', function() {

    });
});

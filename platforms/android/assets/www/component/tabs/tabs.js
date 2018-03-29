var tabs_myConfig = function($stateProvider) {
    $stateProvider
        .state('tab', {
            url: '/tab',
            cache: false,
            abstract: true,
            views: {
                'tab': {
                    templateUrl: "component/tabs/tabs.html",
                    controller: "tabCtrl"
                }
            }
        });
};
myapp.config(tabs_myConfig);

angular.module('starter.tabs', [])
    .controller('tabCtrl', function($scope, $location, Common, $timeout, $state,$ionicHistory,$rootScope) {
        if(!Common.getCache('Token')){
            $state.go('tab.option')
        }else{
            $rootScope.webname =  Common.getCache('Token').site;
        }
        $scope.indexClick = function() {
            window.location.href = "#/tab/tab_index";
        };
        $scope.merchantsClick = function() {
            window.location.href = "#/tab/tab_enter";
        };
        $scope.mineClick = function() {
            window.location.href = "#/tab/tab_mine";
        };

        $scope.gotoTable = function(){
            window.location.href = "#/tab/tab_table";
        }
        $scope.portfolioClick = function(){
            window.location.href = "#/tab/tab_portfolio";
        }
    });

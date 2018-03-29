var tab_portfolio_myConfig = function($stateProvider){
    $stateProvider
    .state('tab.tab_portfolio', {
        url: '/tab_portfolio',
        views: {
            'tab-portfolio': {
                templateUrl: 'component/tab_portfolio/tab_portfolio.html',
                controller: 'tab_portfolioCtrl'
            }
        }
    });
};
myapp.config(tab_portfolio_myConfig);

angular.module('starter.tab_portfolio',[])
.controller('tab_portfolioCtrl', function($scope,$interval,$ionicScrollDelegate,Common) {
    $scope.weishuArr = [
						[
							[true,true,false,false,'2、3','0、1'],
							[true,false,true,false,'1、3','0、2'],
							[true,false,false,true,'1、2','0、3'],
							[false,true,true,false,'0、3','1、2'],
							[false,true,false,true,'0、2','1、3'],
							[false,false,true,true,'0、1','2、3']
						],[
							[true,true,true,false,'3','0、1、2'],
							[true,true,false,true,'2','0、1、3'],
							[true,false,true,true,'1','0、2、3'],
							[false,true,true,true,'0','1、2、3']
						],[
							[true,true,true,true,'','0、1、2、3']
						]
					]
    $scope.changeClick = function(_num){
        $scope.type =_num;
        $ionicScrollDelegate.scrollTop();
        $scope.reset();
    }
    $scope.typeClick = function(_num){
    	$scope.reset();
    	$ionicScrollDelegate.scrollTop();
        $scope.type0 =_num;
        if(_num == 0) $scope.type = 2;
        else if(_num == 1) $scope.type = 3;
        else $scope.type = 0;
    }
    //关闭键盘
    $scope.close = function(){
        $scope.showKeyword = false;

    }
    //点击输入
    $scope.input = function(name,num,type,$event){
        if(type == 0 && !$scope.user[name]){
        	$scope.inputNum = num;
        	$scope.inputType = type;
        	$scope.inputName = name;
            return;
        }
        $ionicScrollDelegate.scrollBy(0,$event.pageY-240,true)
        $scope.inputNum = num;
        $scope.showKeyword = true;
        $scope.inputType = type;
        $scope.inputName = name;
    }
    $scope.numClick = function(_num){
        if($scope.inputType == 1){
            if(_num == '.' || $scope.user[$scope.inputName].length == 0 && _num == '<' || $scope.user[$scope.inputName].toString().indexOf(_num) != -1 ) return;
            else if(_num == '<' && $scope.user[$scope.inputName] != ''){
            	console.log($scope.user[$scope.inputName])
                $scope.user[$scope.inputName] = $scope.user[$scope.inputName].toString().substring(0,$scope.user[$scope.inputName].length -2);
            }
            else if($scope.user[$scope.inputName].length == 0){
                $scope.user[$scope.inputName] = _num;
            }else{
                $scope.user[$scope.inputName] = $scope.user[$scope.inputName] +'、'+_num;
            }
            return;
        }
        if($scope.inputType == 2){
            if(_num == '.' || ($scope.user[$scope.inputName].length == 0 && _num == '<')) return;
            else if(_num == '<' && $scope.user[$scope.inputName] != ''){
                $scope.user[$scope.inputName] = $scope.user[$scope.inputName].toString().substring(0,$scope.user[$scope.inputName].length -1);
            }
            else if($scope.user[$scope.inputName].length == 0){
                $scope.user[$scope.inputName] = _num;
            }else{
                $scope.user[$scope.inputName] = $scope.user[$scope.inputName] +''+_num;
            }
            return;
        }

        if($scope.user.money.length >= 8 && _num != '<' || $scope.user.money.length == 0 && _num == '<') return;
        if(_num == '.' && $scope.user.money == ''){
            $scope.user.money = '0.';
        }else if(_num == '.' && $scope.user.money.indexOf('.') != -1){
            return;
        }
        else if(_num == '<' && $scope.user.money != ''){
            $scope.user.money = $scope.user.money.toString().substring(0,$scope.user.money.length -1);
        }
        else if($scope.user.money.split('.').length == 2 && $scope.user.money.split('.')[1].length == 2){
            return;
        }else{
            $scope.user.money = $scope.user.money+_num;
        }
    }

    $scope.$on('$ionicView.beforeLeave', function() {
        $interval.cancel($scope.newTime);
    });
	$scope.submitClick = function(){
		if($scope.user.money == ''){
			Common.showAlert('','请输入金额！');
			return;
		}
//		Common.showLoading();
		//位数算法
		if($scope.user.qian != '' || $scope.user.bai != '' || $scope.user.shi != '' || $scope.user.ge != ''){
			var _qian = $scope.weishuArr[$scope.type0][$scope.type][0] ? $scope.user.qian.toString().length>0 && ($scope.user.qianP ? 'P、'+$scope.user.qian : $scope.user.qian) || '' :'x';
			var _bai = $scope.weishuArr[$scope.type0][$scope.type][1] ? $scope.user.bai.toString().length>0 && ($scope.user.baiP ? 'P、'+$scope.user.bai : $scope.user.bai) || '' :'x';
			var _shi = $scope.weishuArr[$scope.type0][$scope.type][2] ? $scope.user.shi.toString().length>0 && ($scope.user.shiP ? 'P、'+$scope.user.shi : $scope.user.shi) || '' :'x';
			var _ge = $scope.weishuArr[$scope.type0][$scope.type][3] ? $scope.user.ge.toString().length>0 && ($scope.user.geP ? 'P、'+$scope.user.ge : $scope.user.ge) || '' :'x';
			$scope.suanfa0 = setWeishu($scope.type0,_qian,_bai,_shi,_ge);
			console.log($scope.suanfa0);
		}
		//合数算法
		if($scope.user.heshu0 != ''){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var allChoose = 0;
			var _choose = '';
			for(var i in $scope.user.heshuArr0){
				if($scope.user.heshuArr0[i]){
					_choose = _choose+i+'、';
					allChoose++;
				}
			}
			if(allChoose == 0) _choose = $scope.weishuArr[$scope.type0][$scope.type][5];
			else _choose = _choose.substr(0,_choose.length-1);
			var _sum = $scope.user.heshu0P ? 'P、'+$scope.user.heshu0 : $scope.user.heshu0;
			$scope.suanfa1 = setHeshu($scope.type0,_structure,_choose,_sum.toString())
			console.log($scope.suanfa1)
		}
		if($scope.user.heshu1 != ''){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var allChoose = 0;
			var _choose = '';
			for(var i in $scope.user.heshuArr1){
				if($scope.user.heshuArr1[i]){
					_choose = _choose+i+'、';
					allChoose++;
				}
			}
			if(allChoose == 0) _choose = $scope.weishuArr[$scope.type0][$scope.type][5];
			else _choose = _choose.substr(0,_choose.length-1);
			var _sum = $scope.user.heshu1P ? 'P、'+$scope.user.heshu1 : $scope.user.heshu1;
			$scope.suanfa2 = setHeshu($scope.type0,_structure,_choose,_sum.toString())
			console.log($scope.suanfa2)
		}
		//对数算法
		if($scope.user.duishu0){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _choose = $scope.weishuArr[$scope.type0][$scope.type][5];
			var _sum = $scope.user.duishu0P ? 'P' : '';
			$scope.suanfa3 = setDuishu($scope.type0,_structure,_choose,_sum);
			console.log($scope.suanfa3)
		}
		
		var duishuArrLength1 = 0;
		var _chooseduishu1 = '';
		for(var i in $scope.user.duishu1){
			if($scope.user.duishu1[i]){
				_chooseduishu1 = _chooseduishu1+i+'、';
				duishuArrLength1++;
			}
		}
		if(duishuArrLength1 > 0){
			_chooseduishu1 = _chooseduishu1.substr(0,_chooseduishu1.length-1);
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _sum = $scope.user.duishu1P ? 'P' : '';
			$scope.suanfa4 = setDuishu($scope.type0,_structure,_chooseduishu1,_sum);
			console.log($scope.suanfa4)
		}
		
		var duishuArrLength2 = 0;
		var _chooseduishu2 = '';
		for(var i in $scope.user.duishu2){
			if($scope.user.duishu2[i]){
				_chooseduishu2 = _chooseduishu2+i+'、';
				duishuArrLength2++;
			}
		}
		if(duishuArrLength2 > 0){
			_chooseduishu2 = _chooseduishu2.substr(0,_chooseduishu2.length-1);
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _sum = $scope.user.duishu2P ? 'P' : '';
			$scope.suanfa5 = setDuishu($scope.type0,_structure,_chooseduishu2,_sum);
			console.log($scope.suanfa5)
		}
		
		//双重算法
		if($scope.user.shuangchong0){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _choose = $scope.weishuArr[$scope.type0][$scope.type][5];
			var _sum = $scope.user.shuangchong0P ? 'P' : '';
			$scope.suanfa6 = setShuangchong($scope.type0,_structure,_choose,_sum);
			console.log($scope.suanfa6)
		}
		
		var shuangchongLength1 = 0;
		var _chooseshuangchong1 = '';
		for(var i in $scope.user.shuangchong1){
			if($scope.user.shuangchong1[i]){
				_chooseshuangchong1 = _chooseshuangchong1+i+'、';
				shuangchongLength1++;
			}
		}
		if(shuangchongLength1 > 0){
			_chooseshuangchong1 = _chooseshuangchong1.substr(0,_chooseshuangchong1.length-1);
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _sum = $scope.user.shuangchong1P ? 'P' : '';
			$scope.suanfa7 = setShuangchong($scope.type0,_structure,_chooseshuangchong1,_sum);
			console.log($scope.suanfa7)
		}
		
		var shuangchongLength2 = 0;
		var _chooseshuangchong2 = '';
		for(var i in $scope.user.shuangchong2){
			if($scope.user.shuangchong2[i]){
				_chooseshuangchong2 = _chooseshuangchong2+i+'、';
				shuangchongLength2++;
			}
		}
		if(shuangchongLength2 > 0){
			_chooseshuangchong2 = _chooseshuangchong2.substr(0,_chooseshuangchong2.length-1);
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _sum = $scope.user.shuangchong2P ? 'P' : '';
			$scope.suanfa8 = setShuangchong($scope.type0,_structure,_chooseshuangchong2,_sum);
			console.log($scope.suanfa8)
		}
		
		//全倒算法
		if($scope.user.quandao !=''){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _sum = $scope.user.quandaoP ? 'P' : '';
			$scope.suanfa9 = setQuandao($scope.type0,_structure,$scope.user.quandao,_sum);
			console.log($scope.suanfa9)
		}
		
		//二兄弟算法
		if($scope.user.erxiongdi0){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _choose = $scope.weishuArr[$scope.type0][$scope.type][5];
			var _sum = $scope.user.erxiongdi0P ? 'P' : '';
			$scope.suanfa10 = setxiongdi($scope.type0,_structure,_choose,_sum,2)
			console.log($scope.suanfa10)
		}
		var erxiongdiLength1 = 0;
		var _chooseerxiongdi1 = '';
		for(var i in $scope.user.erxiongdi1){
			if($scope.user.erxiongdi1[i]){
				_chooseerxiongdi1 = _chooseerxiongdi1+i+'、';
				erxiongdiLength1++;
			}
		}
		if(erxiongdiLength1 > 0){
			_chooseerxiongdi1 = _chooseerxiongdi1.substr(0,_chooseerxiongdi1.length-1);
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _sum = $scope.user.erxiongdi1P ? 'P' : '';
			$scope.suanfa11 = setxiongdi($scope.type0,_structure,_chooseerxiongdi1,_sum,2);
			console.log($scope.suanfa11)
		}
		var erxiongdiLength2 = 0;
		var _chooseerxiongdi2 = '';
		for(var i in $scope.user.erxiongdi2){
			if($scope.user.erxiongdi2[i]){
				_chooseerxiongdi2 = _chooseerxiongdi2+i+'、';
				erxiongdiLength2++;
			}
		}
		if(erxiongdiLength2 > 0){
			_chooseerxiongdi2 = _chooseerxiongdi2.substr(0,_chooseerxiongdi2.length-1);
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _sum = $scope.user.erxiongdi2P ? 'P' : '';
			$scope.suanfa12 = setxiongdi($scope.type0,_structure,_chooseerxiongdi2,_sum,2);
			console.log($scope.suanfa12);
		}
		
		
		//三兄弟算法
		if($scope.user.sanxiongdi0){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _choose = $scope.weishuArr[$scope.type0][$scope.type][5];
			var _sum = $scope.user.sanxiongdi0P ? 'P' : '';
			$scope.suanfa13 = setxiongdi($scope.type0,_structure,_choose,_sum,3)
			console.log($scope.suanfa13)
		}
		var sanxiongdiLength1 = 0;
		var _choosesanxiongdi1 = '';
		for(var i in $scope.user.sanxiongdi1){
			if($scope.user.sanxiongdi1[i]){
				_choosesanxiongdi1 = _choosesanxiongdi1+i+'、';
				sanxiongdiLength1++;
			}
		}
		if(sanxiongdiLength1 > 0){
			_choosesanxiongdi1 = _choosesanxiongdi1.substr(0,_choosesanxiongdi1.length-1);
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _sum = $scope.user.sanxiongdi1P ? 'P' : '';
			$scope.suanfa14 = setxiongdi($scope.type0,_structure,_choosesanxiongdi1,_sum,3);
			console.log($scope.suanfa14)
		}
		var sanxiongdiLength2 = 0;
		var _choosesanxiongdi2 = '';
		for(var i in $scope.user.sanxiongdi2){
			if($scope.user.sanxiongdi2[i]){
				_choosesanxiongdi2 = _choosesanxiongdi2+i+'、';
				sanxiongdiLength2++;
			}
		}
		if(sanxiongdiLength2 > 0){
			_choosesanxiongdi2 = _choosesanxiongdi2.substr(0,_choosesanxiongdi2.length-1);
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _sum = $scope.user.sanxiongdi2P ? 'P' : '';
			$scope.suanfa15 = setxiongdi($scope.type0,_structure,_choosesanxiongdi2,_sum,3);
			console.log($scope.suanfa15);
		}
		
		//四兄弟算法
		if($scope.user.sixiongdi0){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var _choose = $scope.weishuArr[$scope.type0][$scope.type][5];
			var _sum = $scope.user.sixiongdi0P ? 'P' : '';
			$scope.suanfa16 = setxiongdi($scope.type0,_structure,_choose,_sum,4)
			console.log($scope.suanfa16)
		}
		//指数算法
		if($scope.user.zhishu0 != '' || $scope.user.zhishu1 != ''){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var allChoose = 0;
			var _choose = '';
			for(var i in $scope.user.zhishuArr0){
				if($scope.user.zhishuArr0[i]){
					_choose = _choose+i+'、';
					allChoose++;
				}
			}
			if(allChoose == 0) _choose = $scope.weishuArr[$scope.type0][$scope.type][5];
			else _choose = _choose.substr(0,_choose.length-1);
			var _sum;
			if($scope.user.zhishu0 != ''){
				_sum = $scope.user.zhishuArr0P ? 'P、'+$scope.user.zhishu0 : $scope.user.zhishu0;
				if($scope.user.zhishu1 != ''){
					_sum = _sum + '、' + 	$scope.user.zhishu1
				}
			}
			else if($scope.user.zhishu1 != ''){
				_sum = $scope.user.zhishuArr0P ? 'P、'+$scope.user.zhishu1 : $scope.user.zhishu1;
			}
			$scope.suanfa17 = setZhishu($scope.type0,_structure,_choose,_sum.toString())
			console.log($scope.suanfa17)
		}
		
		if($scope.user.zhishu2 != '' || $scope.user.zhishu3 != ''){
			var _structure = $scope.weishuArr[$scope.type0][$scope.type][4];
			var allChoose = 0;
			var _choose = '';
			for(var i in $scope.user.zhishuArr1){
				if($scope.user.zhishuArr1[i]){
					_choose = _choose+i+'、';
					allChoose++;
				}
			}
			if(allChoose == 0) _choose = $scope.weishuArr[$scope.type0][$scope.type][5];
			else _choose = _choose.substr(0,_choose.length-1);
			var _sum;
			if($scope.user.zhishu2 != ''){
				_sum = $scope.user.zhishuArr1P ? 'P、'+$scope.user.zhishu2 : $scope.user.zhishu2;
				if($scope.user.zhishu3 != ''){
					_sum = _sum + '、' + 	$scope.user.zhishu3
				}
			}
			else if($scope.user.zhishu3 != ''){
				_sum = $scope.user.zhishuArr1P ? 'P、'+$scope.user.zhishu3 : $scope.user.zhishu3;
			}
			$scope.suanfa18 = setZhishu($scope.type0,_structure,_choose,_sum.toString())
			console.log($scope.suanfa18)
		}
		$scope.allSuanfaArr = []
		for(var g = 0; g < 19; g++){
			if($scope['suanfa'+g] != undefined && $scope['suanfa'+g].length > 0){
				if($scope.allSuanfaArr.length == 0) $scope.allSuanfaArr = $scope['suanfa'+g];
				else $scope.allSuanfaArr = intersection($scope.allSuanfaArr,$scope['suanfa'+g]);
			}
		}
		if($scope.allSuanfaArr.length >3500){
			Common.showAlert('','当前组合超过3500个，请重新筛选！')
		}else if($scope.allSuanfaArr.length >0){
			Common.post("order/getPrepareBuyData",{
				no: $scope.allSuanfaArr.join(','),
				cash : $scope.user.money*1000
			},function(data){
				$scope.PrepareBuyData = data.body;
				for(var i in $scope.PrepareBuyData.list){
					$scope.PrepareBuyData.list[i].choose = true;
				}
				$scope.user.chooseAll = true;
				$scope.showTable = true;
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
			},{},0)
			
		}else{
			Common.showAlert('','无符合此组合条件的号码！')
		}
//		$scope.showTable = true;
//		if($scope.user)
	}
	//全选组合类型
	$scope.chooseAllList = function(){
		for(var i in $scope.PrepareBuyData.list){
			$scope.PrepareBuyData.list[i].choose = $scope.user.chooseAll;
		}
	}
	$scope.hideTable = function(){
		$scope.showTable = false;
		$scope.user.money = '';
	}
	$scope.submitClick0 = function(){
		//最终下注
		var newArr = [];
		for(var i in $scope.PrepareBuyData.list){
			if($scope.PrepareBuyData.list[i].choose) newArr.push($scope.PrepareBuyData.list[i])
		}
		if(newArr.length == 0){
			Common.showAlert('','请选定！');
			return;
		}
		Common.post('order/orderNow',{
        	data : angular.toJson(newArr),
        	rule : ''
        },function(data){
        	Common.showConfirm('','下注成功！',function(){
	            $state.go('tab.index_baobiao')
	        },function(){
	            $scope.showTable = false;
				$scope.reset();
	        },'查看报表','返回')
        })
	}
	//重置
	$scope.reset = function(){
		$scope.inputNum = 0; 
		$scope.showKeyword = false;
		$scope.allSuanfaArr = [];
		for(var g = 0; g < 19; g++){
			$scope['suanfa'+g] = undefined;	
		}
		$scope.user = {
            money : '',
            qian:'',
            qianP : false,
            bai:'',
            baiP : false,
            shi : '',
            shiP : false,
            ge : '',
            geP : false,
            heshu0 : '',
            heshu0P : false,
            heshu1 : '',
            heshu1P : false,
            heshuArr0 : [false,false,false,false],
            heshuArr1 : [false,false,false,false],
            duishu0 : false,
            duishu1 : [false,false,false,false],
            duishu2 : [false,false,false,false],
            quandao : '',
            zhishu0 : '',
            zhishu1 : '',
            zhishu2 : '',
            zhishu3 : '',
            
            shuangchong0 : false,
            shuangchong1 : [false,false,false,false],
            shuangchong2 : [false,false,false,false],
            erxiongdi0 : false,
            erxiongdi0P : false,
            erxiongdi1 : [false,false,false,false],
            erxiongdi1P : false,
            erxiongdi2 : [false,false,false,false],
            erxiongdi2P : false,
            sanxiongdi0 : false,
            sanxiongdi0P : false,
            sanxiongdi1 : [false,false,false,false],
            sanxiongdi1P : false,
            sanxiongdi2 : [false,false,false,false],
            sanxiongdi2P : false,
            sixiongdi0 : false,
            sixiongdi0P : false,
			zhishuArr0 : [false,false,false,false],
			zhishuArr0P : false,
            zhishuArr1 : [false,false,false,false],
            zhishuArr1P : false,
        }
	}
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.type = 2;
        $scope.type0 = 0;
        $scope.inputNum = 0;        //光标位置
        $scope.inputType = 0;       // 输入类型
        $scope.showKeyword = false;
        $scope.bgfoucs = true;
        $scope.showTable = false;  	//显示列表
        $scope.newTime = $interval(function(){
            $scope.bgfoucs = !$scope.bgfoucs;
        },700)
        $scope.reset()
    });
});

angular.module('starter.services', [])
	.filter('bankItem', function() {
		return function(input) {
			// input = "************"+input.substr(12)
			var array = input.replace(/(.{4})(?=.)/g, "$1 ");
			return array;
		}
	})
	.filter('phoneHide', function() {
		return function(input) {
			if(input == null) return '';
			var array = input.substr(0, 3) + '****' + input.substr(7, 4);
			return array;
		}
	})
	.filter('timeOut', function() {
		return function(input) {
			if(input == null) return '';
			var array = Math.floor(input/86400000) + '天' + Math.floor((input%86400000)/3600000) +'小时'+ Math.floor((input%3600000)/60000) + '分'+ Math.floor((input%60000)/1000) +'秒';
//			var array = input.substr(0, 3) + '****' + input.substr(7, 4);
			return array;
		}
	})
	.factory('cordovaPlug', function(toast) {
		$cordovaPlugreturn = {
			CommonPL: function(success, functionName, parameter) {
				try {
					cordova.exec(function(data) {
						success instanceof Function && success(data);
					}, $cordovaPlugreturn.CommonPLError, "CommonPL", functionName, parameter);
				} catch(e) {}
			},
			CommonPLError: function(error) {
				toast.show(error)
			}
		};
		return $cordovaPlugreturn;
	})
	.factory('toast', function(ionicToast) {
		// 静默消息
		$toast = {
			show: function(message) {
				ionicToast.show(message, 'bottom', false, 2000)
			}
		};
		return $toast;
	})
	.factory('Common', function($http, $location, $ionicLoading, $ionicPopup, toast, cordovaPlug, $state, $rootScope, $timeout, actionSheetItem) {
		var app_url = 'https://life.365gl.com/',
			debug_url = 'http://106.14.187.133:8090/',
			mock_url = '',
			ClientVer = '1.0.0',
			url_overtime = 30000,
			isDebug = true, //是否开启测试
			isAleart = false, //被挤下线弹框提醒
			isError = false,

			$return = {
				app_url: isDebug ? debug_url : app_url,
				ClientVer: ClientVer,
				isDebug: isDebug,
				setUrl: function(_url) {
					$return.app_url = _url;
				},
				showLoading: function() {
					var myTimer = 5000;
					$ionicLoading.show({
						content: 'Loading',
						animation: 'fade-in',
						showBackdrop: true,
						template: '<div id="gl_loading" class="spinnere"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
						duration: myTimer
					});
				},
				hideLoading: function() {
					$ionicLoading.hide();
				},
				showAlert: function(title, template, then, okText) {
					if(!isError) {
						var okText = okText || '我知道了';
						isError = true;
						var alertPopup = $ionicPopup.alert({
							template: template,
							okText: okText,
							okType: 'button-light'
						});
						alertPopup.then(function(res) {
							isError = false;
							then instanceof Function && then(res);
						});
					}
					setTimeout(function() {
						isError = false;
					}, 3000)
				},
				showConfirm: function(title, template, ok, cancel, okText, cancelText) {
					if(!isAleart) {
						isAleart = true;
						var confirmPopup = $ionicPopup.confirm({
							template: template,
							buttons: [{
								text: cancelText || '取消',
								type: 'button-light',
								onTap: function(e) {
									isAleart = false;
									cancel instanceof Function && cancel();
								}
							}, {
								text: okText || '确定',
								type: 'button-light',
								onTap: function(e) {
									isAleart = false;
									ok instanceof Function && ok();
								}
							}]
						});
					}
					setTimeout(function() {
						isAleart = false;
					}, 3000)
				},
				setCache: function($key, $value, $expire) {
					var object = {
						value: $value,
						timestamp: $expire && (parseInt($expire) + new Date().getTime()) || '0'
					};
					localStorage.setItem($key, JSON.stringify(object));
				},
				getCache: function($key) {
					var cache = localStorage.getItem($key);
					if(cache) {
						var object = JSON.parse(localStorage.getItem($key)),
							dateString = object.timestamp,
							now = new Date().getTime().toString();
						if(dateString != '0' && now > dateString) {
							localStorage.removeItem($key);
							return null;
						}
						return object.value;
					} else return null;
				},
				clearCache: function($key) {
					localStorage.removeItem($key);
				},
				logout: function() {
					$return.clearCache('Token');
					$return.clearCache('information');
					$return.clearCache('balanceNum');
					$return.clearCache('hasClickBalance');
					$return.clearCache('bankList');
					$return.clearCache('bannerImg');
				},
				//解析地址参数
				getQueryString: function(url, name) {
					var query = url.substring(1);
					var vars = query.split("&");
					for(var i = 0; i < vars.length; i++) {
						var pair = vars[i].split("=");
						if(pair[0] == name) {
							return pair[1];
						}
					}
					return(false);
				},
				//生成uuid
				uuid: function() {
					return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
						var r = Math.random() * 16 | 0,
							v = c == 'x' ? r : (r & 0x3 | 0x8);
						return v.toString(16);
					});
				},
				//MD5加密算法
        checkMd5: function(_string, success) {
            var data = {
                'MD5': hex_md5(_string.toString())
            }
            if (success) {
                success instanceof Function && success(data);
            } else {
                return data.MD5;
            }
            return;
        },
				get: function(url, data, success, error, loading) {
					/*if (!$return.isnetwork()) {
					  $return.showAlert('温馨提示', "网络连接错误，请检查网络连接");
					  return;
					}*/
					if(loading != undefined) $return.showLoading();
					console.time('请求时间：');
					data = data instanceof Object && data || {};
					var authUser = '',
						authPasswd = '',
						urlOther = '';
					if($return.getCache('Token') != null) {
						authUser = $return.getCache('Token').authUser;
						authPasswd = $return.getCache('Token').authPasswd;
						urlOther = $return.getCache('Token').url;
					}
					newHttp();

					function newHttp() {
						$http({
							method: 'get',
							url: $return.app_url + urlOther + url,
							params: data,
							headers: {
								"authUser": authUser,
								"authPasswd": authPasswd
							},
							timeout: url_overtime
						}).then(function successCallback(data) {
							console.timeEnd('请求时间：');
							data = data.data;
							if(data.state == "1") success instanceof Function && success(data);
							else {
								$return.showAlert('温馨提示', data.msg, function() {
									$return.hideLoading();
								});
							}
							if(loading != undefined) $return.hideLoading();
						}, function errorCallback(data) {
							if(loading != undefined) $return.hideLoading();
							data && data.msg ? $return.showAlert('温馨提示', data.msg) : $return.showAlert('温馨提示', "网络连接错误，请稍后再试！");
							error instanceof Function && error(data);
						});
					}
				},
				post: function(url, data, success, error, loading) {
					/*if (!$return.isnetwork()) {
					  $return.showAlert('温馨提示', "网络连接错误，请检查网络连接");
					  return;
					}*/
					if(loading != undefined) $return.showLoading();
					var myToken = '';
					console.time('请求时间：');
					data = data instanceof Object && data || {};
					var authUser = '',
						authPasswd = '',
						urlOther = '';
					if($return.getCache('Token') != null) {
						authUser = $return.getCache('Token').authUser;
						authPasswd = $return.getCache('Token').authPasswd;
						urlOther = $return.getCache('Token').url;
					}
					newHttp();

					function newHttp() {
						$http({
							method: 'post',
							url: $return.app_url + urlOther + url,
							data: data,
							headers: {
								"authUser": authUser,
								"authPasswd": authPasswd
							},
							timeout: url_overtime
						}).then(function successCallback(data) {
							console.timeEnd('请求时间：');
							data = data.data;
							if(data.state == "1") success instanceof Function && success(data);
							else $return.showAlert('温馨提示', data.msg, function() {
								$return.hideLoading();
							});
							if(loading != undefined) $return.hideLoading();
						}, function errorCallback(data) {
							if(loading != undefined) $return.hideLoading();
							data && data.msg ? $return.showAlert('温馨提示', data.msg) : $return.showAlert('温馨提示', "网络连接错误，请稍后再试！");
							error instanceof Function && error(data);
						});
					}
				},
				post_send: function() {
					var authUser = '',authPasswd = '';
					if($return.getCache('Token') != null) {
						authUser = $return.getCache('Token').authUser;
						authPasswd = $return.getCache('Token').authPasswd;
					}
					newHttp();
					function newHttp() {
						$http({
							method: 'post',
							url: $return.app_url + 'interfaces/home/user/sendAliveState',
							data: {
								type: 3,
								authUser: authUser,
								authPasswd: authPasswd
							},
							headers: {
								"authUser": authUser,
								"authPasswd": authPasswd
							},
							timeout: url_overtime
						}).then(function successCallback(data) {
							
						}, function errorCallback(data) {
							
						});
					}
				}
			}
		return $return;
	})
	.factory('actionSheetItem', function($document, $compile, $rootScope, $timeout, $http, $templateCache, $state, cordovaPlug, $ionicModal) {
		var body = $document.find('body'),
			container

		function close() {
			container.removeClass('active')
			$timeout(function() {
				container.remove()
			}, 250)
		}

		function show(bak) {
			$timeout(function() {
				container.addClass('active')
				if(bak) bak(container)
			}, 50)
		}
		/*
		 * 举报
		 * confirmButton  确认文字
		 * confirm 成功回调函数
		 * cancel 取消回调函数
		 * items 选项列表
		 * */
		function showChoose(option) {
			var items = option.items,
				chooseItem = [],
				confirmButton = option.confirmButton ? option.confirmButton : '确认';
			container = angular.element('<div id="tab_store_action-sheet-container"></div>')
			body.append(container);

			var $scope = $rootScope.$new();
			$scope.choose = function() {
				container.removeClass('active')
				$timeout(function() {
					container.remove()
				}, 250)
				if(option.confirm) option.confirm(chooseItem)
			}
			$scope.select = function(i, e) {
				if(angular.element(e.target).hasClass('selected')) {
					angular.element(e.target).removeClass('selected')
					chooseItem.splice(chooseItem.indexOf(i), 1)
				} else {
					angular.element(e.target).addClass('selected')
					chooseItem.push(i)
				}
			}
			$scope.cancel = function(i, e) {
				close()
				if(option.cancel) option.cancel(chooseItem)
			}

			var html = '<div><div class="bg" ng-click="cancel()"></div><div class="box"><div class="items-box">'
			for(var i = 0; i < items.length; i++) {
				html += '<span ng-click="select(' + i + ',$event)">' + items[i] + '</span>'
			}
			html += '</div><div class="options"><a class="confirm" href="javascript:void(0)" ng-click="choose()">' + confirmButton + '</a></div></div></div>'
			html = $compile(html)($scope);
			container.append(html)
			show()
		}
		//显示电话号码 tel 电话号码
		function showTel(tel) {
			container = angular.element('<div id="tab_store_action-sheet-container"></div>')
			body.append(container);
			var $scope = $rootScope.$new();
			$scope.cancel = function(i, e) {
				close()
			}
			$scope.call = function(i, e) {
				cordovaPlug.CommonPL(function() {
					//隐藏拨打弹框
				}, "telephone", [tel])
				close()
			}
			var html = '<div><div class="bg" ng-click="cancel()"></div><div class="box tel-box"><div class="items-box">'
			html += '<span ng-click="call()">' + tel + '</span>'
			html += '</div><div class="options">' +
				'<a class="cancel" href="javascript:void(0)" ng-click="cancel()">取消</a></div></div></div>'
			html = $compile(html)($scope);
			container.append(html)
			show()
		}
		//显示支付完成页面
		function successPay(_num) {
			container = angular.element('<div id="tab_store_action-sheet-container"></div>')
			body.append(container);
			var $scope = $rootScope.$new();
			$scope.cancel = function(i, e) {
				close()
			}
			$scope.call = function(i, e) {
				close();
			}
			var html = '<div ng-click="call()"><div class="bg" ng-click="call()"></div><div class="popbox cjc_paybg"><img src="img/pay/close-btn.png" style="position: absolute;width: 0.8rem;height: 0.8rem;top:7.4rem;" alt=""><img src="img/hdqImg/@2xweep.png" alt=""><div class="cjc_pay_tip"><div class="colorff f32 tc">支付成功，您己获得' + _num + '乐豆</div><div class="tc f24 colorff cjc_pay_moretip">乐豆可在任何合作商店消费相当于' + _num + '元现金</div></div></div></div>'
			html = $compile(html)($scope);
			container.append(html)
			show()
		}
		//显示银行卡更换
		function changeBank(data, index, success) {
			container = angular.element('<div id="tab_store_action-sheet-container"></div>')
			body.append(container);
			var $scope = $rootScope.$new();
			$scope.cancel = function(i, e) {
				close()
			}
			$scope.serverSideChange = function(e) {
				success instanceof Function && success(e);
				close();
			}
			$scope.data = data;
			$scope.index = index;
			var html = '<div><div class="bg" ng-click="cancel()"></div><div class="box bankBox p0-24">'
			html += '<div class="cjc_bank_title bor-bot">选择优先支付方式</div><div class="cjc_bank_tip">优先使用所选支付方式付款，如付款失败将尝试使用其他支付方式完成付款</div>';
			html += '<div class="banklist"><ion-radio ng-repeat="item in data"  class="cjc_banklist f32 color33 bor-bot"  ' +
				'ng-value="item.value" ng-click="serverSideChange(item)" ' +
				'ng-if="item.color != undefined" ng-class="{true:\'active\',false:\'\'}[index==item.cardIndex]"> <img ng-src="{{item.bankImg}}" ' +
				'alt=""><span>{{item.bankName}}</span><span>{{item.cardType =="C" && " 信用卡" || " 储蓄卡"}}</span>' +
				' <span>({{item.cardNo.substr(-4,4)}})</span></ion-radio><div class="cjc_height"></div></div></div>'
			html = $compile(html)($scope);
			container.append(html)
			show()
		}
		//暂停使用二维码弹框
		function showMadal(instructions, stopfunction) {
			container = angular.element('<div id="tab_store_action-sheet-container"></div>')
			body.append(container);
			var $scope = $rootScope.$new();
			$scope.cancel = function(i, e) {
				close()
			}
			$scope.stop = function(i, e) {
				stopfunction instanceof Function && stopfunction();
				close()
			}
			$scope.call = function(i, e) {
				instructions instanceof Function && instructions();
				close()
			}
			var html = '<div><div class="bg" ng-click="cancel()"></div><div class="box tel-box"><div class="items-box" ng-click="call()">'
			html += '<span style="color:#333;">使用说明</span></div><div class="items-box" ng-click="stop()"><span>暂停使用</span></div>'
			html += '<div class="options" ng-click="cancel()">' +
				'<a class="cancel" href="javascript:void(0)">取消</a></div></div></div>'
			html = $compile(html)($scope);
			container.append(html)
			show()
		}
		//显示未实名认证的
		function showAuthentication(init) {
			container = angular.element('<div id="tab_store_action-sheet-container"></div>')
			body.append(container);
			var $scope = $rootScope.$new();
			$scope.cancel = function(i, e) {
				close()
			}
			$scope.gotoCertification = function(i, e) {
				init instanceof Function && init();
				close()
			}
			var html = '<div class="bg" ng-click="cancel()"></div>'
			html += '<div class="cjc_showalert f28 box"><div class="cjc_alert_padding"><p class="success_1 bor-bot">完善资料<span ng-click="cancel()" class="err_img2"><i class="icon ion-close-round"></i></span></p> <div class="color66">尊敬的用户，为了您更好的体验给乐生活，请先去完成实名认证！</div></div><div class="df"><div class="df1" ng-click="gotoCertification()">马 上 认 证</div></div>'
			html = $compile(html)($scope);
			container.append(html)
			show();
		}
		/*
		 * 仿madal弹框
		 * scope 作用域
		 * templateUrl 模板地址
		 * template  模板文本
		 * success  插入好回调函数，参数：container(插入的节点对象)
		 * */
		function showPage(option) {
			var html = angular.element('<div class="box page-box"></div>')
			container = angular.element('<div id="tab_store_action-sheet-container"></div>')
			body.append(container);
			container.append(html);
			option.scope.cancel = function(i, e) {
				close()
				option.scope.closeModal()
			}
			if(option.template) {
				var page = $compile(option.template)(option.scope);
				html.append(page)
				show(option.success)
				return
			}
			$http.get(option.templateUrl, {
					cache: $templateCache
				})
				.then(function(response) {
					var page = $compile(response.data)(option.scope);
					html.append(page)
					show(option.success)

				});

		}

		return {
			showChoose: showChoose,
			showTel: showTel,
			showPage: showPage,
			showMadal: showMadal,
			showAuthentication: showAuthentication,
			changeBank: changeBank,
			successPay: successPay,
			close: close
		}
	})
	.directive('uiCheckSref', function($state, Common, commonConfigsJson) {
		return {
			restrict: 'A',
			require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
			link: function(scope, element, $attr, uiSrefActive) {
				var ref = parseStateRef($attr['uiCheckSref']),
					state = ref.state,
					param = scope.$eval(ref.paramExpr)
				if(ref.paramExpr) {
					scope.$watch(ref.paramExpr, function(val$$1) {
						param = val$$1;
					}, true);
				}

				function parseStateRef(ref) {
					var paramsOnly = ref.match(/^\s*({[^}]*})\s*$/),
						parsed;
					if(paramsOnly)
						ref = '(' + paramsOnly[1] + ')';
					parsed = ref.replace(/\n/g, " ").match(/^\s*([^(]*?)\s*(\((.*)\))?\s*$/);
					if(!parsed || parsed.length !== 4)
						throw new Error("Invalid state ref '" + ref + "'");
					return {
						state: parsed[1] || null,
						paramExpr: parsed[3] || null
					};
				}
				element.on('click', function() {
					console.log(Common.isDebug)
					if(!commonConfigsJson.isApp || Common.isDebug) {
						$state.go(state, param);
						return
					}
					Common.isNetwordConnected(function() {
						$state.go(state, param);
					})
				})
			}
		}
	})
var twoArr = function(){
		console.time('testForEach');
		var myArr = [];
		for(i=0;i<4;i++){
			for(j=i+1;j<4;j++){
				for(n=0;n<10;n++){
					for(m=0;m<10;m++){
						var newArr = [n.toString(),m.toString()];
						newArr.splice(i,0,"x");
						newArr.splice(j,0,"x");
						myArr.push(newArr);
					}
				}
			}
		}
		console.timeEnd('testForEach');
		return myArr;
	}
	var threeArr = function(){
		console.time('testForEach');
		var myArr = [];
		for(i=0;i<4;i++){
			for(j=0;j<10;j++){
				for(n=0;n<10;n++){
					for(m=0;m<10;m++){
						var newArr = [j.toString(),n.toString(),m.toString()];
						newArr.splice(i,0,"x");
						myArr.push(newArr);
					}
				}
			}
		}
		console.timeEnd('testForEach');
		return myArr;
	}
	var fourArr = function(){
		console.time('testForEach');
		var myArr = [];
		for(i=0;i<10;i++){
			for(j=0;j<10;j++){
				for(n=0;n<10;n++){
					for(m=0;m<10;m++){
						var newArr = [i.toString(),j.toString(),n.toString(),m.toString()];
						myArr.push(newArr);
					}
				}
			}
		}
		console.timeEnd('testForEach');
		return myArr;
	}
	var allArr = ['0','1','2','3','4','5','6','7','8','9'];
	//数组交集
	var intersection  = function(_arr0,_arr1){
		var newArr = [];
		for(var i = 0; i<_arr0.length; i ++){
			if(_arr1.indexOf(_arr0[i]) != -1) newArr.push(_arr0[i])
		}
		return newArr;
	}
	
	/*
	位数
	type -- 0:二字
		 -- 1：三字
		 --	2：前四
	_qian -- P:排除
	// setWeishu(0,'','P、4、5','x','x')
	*/
	var setWeishu = function(_type,_qian,_bai,_shi,_ge){
		var oldArr = _type == 0 && twoArr() || _type == 1 && threeArr() || fourArr();
		var myArrLen = oldArr.length;
		var qian = _qian == '' && allArr || _qian.toString().split('、');
		var bai = _bai == '' && allArr || _bai.toString().split('、');;
		var shi = _shi == '' && allArr || _shi.toString().split('、');
		var ge = _ge == '' && allArr || _ge.toString().split('、');
		var newArr = []
		for(i = 0;i<myArrLen; i++){
			if((qian[0] == 'P' ? qian.indexOf(oldArr[i][0]) == -1 : qian.indexOf(oldArr[i][0]) != -1) && 
				(bai[0] == 'P' ? bai.indexOf(oldArr[i][1]) == -1 : bai.indexOf(oldArr[i][1]) != -1) && 
				(shi[0] == 'P' ? shi.indexOf(oldArr[i][2]) == -1 : shi.indexOf(oldArr[i][2]) != -1) && 
				(ge[0] == 'P' ? ge.indexOf(oldArr[i][3]) == -1 : ge.indexOf(oldArr[i][3]) != -1) ){
				newArr.push(oldArr[i].join(''))
			}
		}
		return newArr
	}
	var getArr = function(_arr){
		var chooseArr = []
		for(var o = 0; o < 4; o++){
			if(_arr.indexOf(o.toString()) == -1) chooseArr.push(o.toString())
		}
		return chooseArr
	}
	/*
	合数
	type -- 0:二字
		 -- 1：三字
		 --	2：前四
	_structure -- 结构，X所在的引索位置
	_choose  -- 合数位置，用于计算合数的数值所在的引索位置
	_sum  -- 合数尾数（P排除）
	setHeshu(1,'2','0、1','P、1、5')
	*/
	var setHeshu = function(_type,_structure,_choose,_sum){
		var oldArr = _type == 0 && twoArr() || _type == 1 && threeArr() || fourArr();
		var myArrLen = oldArr.length;
		var structure = _structure == '' ? [] : _structure.split('、');
		var choose = _choose == '' ? getArr(structure) : _choose.split('、');
		var sum = _sum.split('、');
		var newArr = [];
		all:
		for(i = 0;i<myArrLen; i++){
			for(x = 0; x < structure.length; x++){
				if(oldArr[i][structure[x]] != 'x') continue all;
			}
			var newSum = 0;
			for(j =0 ;j<choose.length;j++){
				if(oldArr[i][choose[j]] == 'x') continue all;
				newSum += Number(oldArr[i][choose[j]])
			}
			newSum = newSum%10;
			if(sum[0] == 'P' && sum.indexOf(newSum.toString()) == -1){
				newArr.push(oldArr[i].join(''))
			}else if(sum[0] != 'P' && sum.indexOf(newSum.toString()) != -1){
				newArr.push(oldArr[i].join(''))
			}
		}
		return newArr;
		
	}
	/*
	值数
	type -- 0:二字
		 -- 1：三字
		 --	2：前四
	_structure -- 结构，X所在的引索位置
	_choose  -- 合数位置，用于计算合数的数值所在的引索位置
	_sum  -- 合数尾数（P排除）
	setZhishu(1,'2','0、1','P、1、5')
	*/
	var setZhishu = function(_type,_structure,_choose,_sum){
		var oldArr = _type == 0 && twoArr() || _type == 1 && threeArr() || fourArr();
		var myArrLen = oldArr.length;
		var structure = _structure == '' ? [] : _structure.split('、');
		var choose = _choose == '' ? getArr(structure) : _choose.split('、');
		var sum = _sum.split('、');
		var newArr = [];
		all:
		for(i = 0;i<myArrLen; i++){
			for(x = 0; x < structure.length; x++){
				if(oldArr[i][structure[x]] != 'x') continue all;
			}
			var newSum = 0;
			for(j =0 ;j<choose.length;j++){
				if(oldArr[i][choose[j]] == 'x'){
					newSum = '';
					break;
				} 
				newSum += Number(oldArr[i][choose[j]])
			}
			if(sum[0] == 'P' && sum.indexOf(newSum.toString()) == -1){
				newArr.push(oldArr[i].join(''))
			}else if(sum[0] != 'P' && sum.indexOf(newSum.toString()) != -1){
				newArr.push(oldArr[i].join(''))
			}
		}
		return newArr
	}

	/*
	对数
	type -- 0:二字
		 -- 1：三字
		 --	2：前四
	_structure -- 结构，X所在的引索位置
	_choose  -- 对数位置，用于计算对数的数值所在的引索位置
	_sum  -- （P排除）
	setDuishu(1,'2','0、1','P')
	*/
	
	var setDuishu = function(_type,_structure,_choose,_sum){
		var oldArr = _type == 0 && twoArr() || _type == 1 && threeArr() || fourArr();
		var myArrLen = oldArr.length;
		var structure = _structure == '' ? [] : _structure.split('、');
		var choose = _choose == '' ? getArr(structure) : _choose.split('、');
		var sum = _sum.split('、');
		var newArr = [];
		if(choose.length < 2){
			return newArr;
		}
		all:
		for(i = 0;i<myArrLen; i++){
			for(x = 0; x < structure.length; x++){
				if(oldArr[i][structure[x]] != 'x') continue all;
			}
			var newSum = 0;
			var newSumArr = [];
			for(j =0 ;j<choose.length;j++){
				if(oldArr[i][choose[j]] != 'x'){
					newSumArr.push(oldArr[i][choose[j]])
				}
			}
			if(newSumArr.length == choose.length){
				newSumArr.sort().reverse();
				for(var m = 0 ; m < newSumArr.length; m++){
					for(var n = m+1; n < newSumArr.length; n++){
						if(newSumArr[m] - newSumArr[n] == 5) newSum++;
					}
				}
				if(sum[0] != 'P' && newSum != 0){
					newArr.push(oldArr[i].join(''))
				}else if(sum[0] == 'P' && newSum == 0){
					newArr.push(oldArr[i].join(''))
				}
			}
		}
		return newArr
	}
	/*
	全倒
	type -- 0:二字
		 -- 1：三字
		 --	2：前四
	_structure -- 结构，X所在的引索位置
	_sum  -- 全倒数字
	_paichu -- P -排除
	setQuandao(1,'0','0、1','P')
	*/
	var setQuandao = function(_type,_structure,_sum,_paichu){
		var oldArr = _type == 0 && twoArr() || _type == 1 && threeArr() || fourArr();
		var myArrLen = oldArr.length;
		var structure = _structure == '' ? [] : _structure.split('、');
		var newArr = [];
		all:
		for(i = 0;i<myArrLen; i++){
			for(x = 0; x < structure.length; x++){
				if(oldArr[i][structure[x]] != 'x') continue all;
			}
			var sum = _sum.split('、');
			if(sum.length < _type+2){
				return newArr;
			}
			var l = 0;
			for(var m = 0; m<4;m++){
				if(oldArr[i][m] != 'x' && sum.indexOf(oldArr[i][m]) != -1){
					l++;
					sum.splice(sum.indexOf(oldArr[i][m]),1)
				}
			}
			if(l == _type+2 && _paichu != "P") newArr.push(oldArr[i].join(''))
			else if(l != _type+2 &&_paichu == "P") newArr.push(oldArr[i].join(''))
		}
		return newArr
	}

	/*
	双重
	type -- 0:二字
		 -- 1：三字
		 --	2：前四
	_structure -- 结构，X所在的引索位置
	_choose  -- 双重位置，用于计算双重所在的引索位置
	_sum  -- （P排除）
	setShuangchong(1,'2','0、1、3','')
	*/
	
	var setShuangchong = function(_type,_structure,_choose,_sum){
		var oldArr = _type == 0 && twoArr() || _type == 1 && threeArr() || fourArr();
		var myArrLen = oldArr.length;
		var structure = _structure == '' ? [] : _structure.split('、');
		var choose = _choose == '' ? getArr(structure) : _choose.split('、');
		var sum = _sum.split('、');
		var newArr = [];
		
		if(choose.length < 2){
			return newArr;
		}

		all:
		for(i = 0;i<myArrLen; i++){
			for(x = 0; x < structure.length; x++){
				if(oldArr[i][structure[x]] != 'x') continue all;
			}
			var h = 0;
			for(j =0 ;j<choose.length;j++){
				for(m = j+1; m < choose.length;m++){
					if(oldArr[i][choose[j]] == oldArr[i][choose[m]]) h++;
				}
			}
			if(h == 0 && _sum == "P") newArr.push(oldArr[i].join(''))
			else if(h != 0 && _sum != "P") newArr.push(oldArr[i].join(''))
		}
		return newArr
	}
	/*
	几兄弟
	type -- 0:二字
		 -- 1：三字
		 --	2：前四
	_structure -- 结构，X所在的引索位置
	_choose  -- 兄弟位置，用于计算几兄弟所在的引索位置
	_sum  -- （P排除）
	_type0 -- (2\3\4  几兄弟)
	setxiongdi(0,'2、3','0、1',',2)
	*/
	
	var setxiongdi = function(_type,_structure,_choose,_sum,_type0){
		var oldArr = _type == 0 && twoArr() || _type == 1 && threeArr() || fourArr();
		// oldArr = [["1", "x", "1", "2"]]
		var myArrLen = oldArr.length;
		var structure = _structure == '' ? [] : _structure.split('、');
		var choose = _choose == '' ? getArr(structure) : _choose.split('、');
		var sum = _sum.split('、');
		var newArr = [];
		
		if((choose.length < 2 && _type0 == 2 )|| (choose.length < 3 && _type0 == 3)){
			return newArr;
		}
		all:
		for(i = 0;i<myArrLen; i++){
			for(x = 0; x < structure.length; x++){
				if(oldArr[i][structure[x]] != 'x') continue all;
			}
			var h = 0;
			if(_type0 == 2){
				
				if(oldArr[i][choose[0]]-1 == oldArr[i][choose[1]]  ||
					 oldArr[i][choose[0]] == oldArr[i][choose[1]]-1 ||
					 oldArr[i][choose[0]]-9 == oldArr[i][choose[1]]  ||
					 oldArr[i][choose[0]] == oldArr[i][choose[1]]-9) h++;
			}else if(_type0 == 3){
				if((oldArr[i][choose[0]] == oldArr[i][choose[1]]-1 && oldArr[i][choose[1]]-1 == oldArr[i][choose[2]]-2)||
					(oldArr[i][choose[0]] == oldArr[i][choose[1]]-2 && oldArr[i][choose[1]]-2 == oldArr[i][choose[2]]-1) ||
					(oldArr[i][choose[0]]-1 == oldArr[i][choose[1]] && oldArr[i][choose[1]] == oldArr[i][choose[2]]-2 )||
					(oldArr[i][choose[0]]-1 == oldArr[i][choose[1]]-2 && oldArr[i][choose[1]]-2 == oldArr[i][choose[2]]) ||
					(oldArr[i][choose[0]]-2 == oldArr[i][choose[1]] && oldArr[i][choose[1]] == oldArr[i][choose[2]]-1) ||
					(oldArr[i][choose[0]]-2 == oldArr[i][choose[1]]-1 && oldArr[i][choose[1]]-1 == oldArr[i][choose[2]])) h++;
				if(oldArr[i][choose[0]] == '0'){
					if(((oldArr[i][choose[1]] == '1' || oldArr[i][choose[1]] == '8') && oldArr[i][choose[2]] == '9')||
						((oldArr[i][choose[2]] == '1' || oldArr[i][choose[2]] == '8') && oldArr[i][choose[1]] == '9')) h++
				}
				if(oldArr[i][choose[1]] == '0'){
					if(((oldArr[i][choose[0]] == '1' || oldArr[i][choose[0]] == '8') && oldArr[i][choose[2]] == '9')||
						((oldArr[i][choose[2]] == '1' || oldArr[i][choose[2]] == '8') && oldArr[i][choose[0]] == '9')) h++
				}
				if(oldArr[i][choose[2]] == '0'){
					if(((oldArr[i][choose[1]] == '1' || oldArr[i][choose[1]] == '8') && oldArr[i][choose[0]] == '9')||
						((oldArr[i][choose[0]] == '1' || oldArr[i][choose[0]] == '8') && oldArr[i][choose[1]] == '9')) h++
				}
			}
			else if(_type0 == 4){
				if((oldArr[i][choose[0]] == oldArr[i][choose[1]]-1 && oldArr[i][choose[0]] == oldArr[i][choose[2]]-2  && oldArr[i][choose[0]] == oldArr[i][choose[3]]-3) ||
					(oldArr[i][choose[0]] == oldArr[i][choose[1]]-1 && oldArr[i][choose[0]] == oldArr[i][choose[2]]-3  && oldArr[i][choose[0]] == oldArr[i][choose[3]]-2) ||
					(oldArr[i][choose[0]] == oldArr[i][choose[1]]-2 && oldArr[i][choose[0]] == oldArr[i][choose[2]]-1  && oldArr[i][choose[0]] == oldArr[i][choose[3]]-3) || 
					(oldArr[i][choose[0]] == oldArr[i][choose[1]]-2 && oldArr[i][choose[0]] == oldArr[i][choose[2]]-3  && oldArr[i][choose[0]] == oldArr[i][choose[3]]-1) || 
					(oldArr[i][choose[0]] == oldArr[i][choose[1]]-3 && oldArr[i][choose[0]] == oldArr[i][choose[2]]-1  && oldArr[i][choose[0]] == oldArr[i][choose[3]]-2) || 
					(oldArr[i][choose[0]] == oldArr[i][choose[1]]-3 && oldArr[i][choose[0]] == oldArr[i][choose[2]]-2  && oldArr[i][choose[0]] == oldArr[i][choose[3]]-1) || 

					(oldArr[i][choose[0]]-1 == oldArr[i][choose[1]] && oldArr[i][choose[0]]-1 == oldArr[i][choose[2]]-2  && oldArr[i][choose[0]]-1 == oldArr[i][choose[3]]-3) || 
					(oldArr[i][choose[0]]-1 == oldArr[i][choose[1]] && oldArr[i][choose[0]]-1 == oldArr[i][choose[2]]-3  && oldArr[i][choose[0]]-1 == oldArr[i][choose[3]]-2) || 
					(oldArr[i][choose[0]]-1 == oldArr[i][choose[1]]-2 && oldArr[i][choose[0]]-1 == oldArr[i][choose[2]]  && oldArr[i][choose[0]]-1 == oldArr[i][choose[3]]-3) || 
					(oldArr[i][choose[0]]-1 == oldArr[i][choose[1]]-2 && oldArr[i][choose[0]]-1 == oldArr[i][choose[2]]-3  && oldArr[i][choose[0]]-1 == oldArr[i][choose[3]]) || 
					(oldArr[i][choose[0]]-1 == oldArr[i][choose[1]]-3 && oldArr[i][choose[0]]-1 == oldArr[i][choose[2]]  && oldArr[i][choose[0]]-1 == oldArr[i][choose[3]]-2) || 
					(oldArr[i][choose[0]]-1 == oldArr[i][choose[1]]-3 && oldArr[i][choose[0]]-1 == oldArr[i][choose[2]]-2  && oldArr[i][choose[0]]-1 == oldArr[i][choose[3]]) || 

					(oldArr[i][choose[0]]-2 == oldArr[i][choose[1]] && oldArr[i][choose[0]]-2 == oldArr[i][choose[2]]-1  && oldArr[i][choose[0]]-2 == oldArr[i][choose[3]]-3) || 
					(oldArr[i][choose[0]]-2 == oldArr[i][choose[1]] && oldArr[i][choose[0]]-2 == oldArr[i][choose[2]]-3  && oldArr[i][choose[0]]-2 == oldArr[i][choose[3]]-1) || 
					(oldArr[i][choose[0]]-2 == oldArr[i][choose[1]]-1 && oldArr[i][choose[0]]-2 == oldArr[i][choose[2]]  && oldArr[i][choose[0]]-2 == oldArr[i][choose[3]]-3) || 
					(oldArr[i][choose[0]]-2 == oldArr[i][choose[1]]-1 && oldArr[i][choose[0]]-2 == oldArr[i][choose[2]]-3  && oldArr[i][choose[0]]-2 == oldArr[i][choose[3]]) || 
					(oldArr[i][choose[0]]-2 == oldArr[i][choose[1]]-3 && oldArr[i][choose[0]]-2 == oldArr[i][choose[2]]  && oldArr[i][choose[0]]-2 == oldArr[i][choose[3]]-1) || 
					(oldArr[i][choose[0]]-2 == oldArr[i][choose[1]]-3 && oldArr[i][choose[0]]-2 == oldArr[i][choose[2]]-1  && oldArr[i][choose[0]]-2 == oldArr[i][choose[3]]) || 

					(oldArr[i][choose[0]]-3 == oldArr[i][choose[1]] && oldArr[i][choose[0]]-3 == oldArr[i][choose[2]]-1  && oldArr[i][choose[0]]-3 == oldArr[i][choose[3]]-2) || 
					(oldArr[i][choose[0]]-3 == oldArr[i][choose[1]] && oldArr[i][choose[0]]-3 == oldArr[i][choose[2]]-2  && oldArr[i][choose[0]]-3 == oldArr[i][choose[3]]-1) || 
					(oldArr[i][choose[0]]-3 == oldArr[i][choose[1]]-1 && oldArr[i][choose[0]]-3 == oldArr[i][choose[2]]  && oldArr[i][choose[0]]-3 == oldArr[i][choose[3]]-2) || 
					(oldArr[i][choose[0]]-3 == oldArr[i][choose[1]]-1 && oldArr[i][choose[0]]-3 == oldArr[i][choose[2]]-2  && oldArr[i][choose[0]]-3 == oldArr[i][choose[3]]) || 
					(oldArr[i][choose[0]]-3 == oldArr[i][choose[1]]-2 && oldArr[i][choose[0]]-3 == oldArr[i][choose[2]]  && oldArr[i][choose[0]]-3 == oldArr[i][choose[3]]-1) || 
					(oldArr[i][choose[0]]-3 == oldArr[i][choose[1]]-2 && oldArr[i][choose[0]]-3 == oldArr[i][choose[2]]-1  && oldArr[i][choose[0]]-3 == oldArr[i][choose[3]])) h++;

				var four = [['0','1','2','9'],['0','1','8','9'],['0','7','8','9']]
				for(m = 0; m < four.length; m++){
					var n = 0;
					for(j =0 ;j<choose.length;j++){
						var newNum = four[m].indexOf(oldArr[i][choose[j]]);
						if(newNum != -1){
							n++;
							four[m].splice(newNum,1);
						}
					}
					if(n == 4) h++
					
				}
			}
			if(h == 0 && _sum == "P") newArr.push(oldArr[i].join(''))
			else if(h != 0 && _sum != "P") newArr.push(oldArr[i].join(''))
			
		}
		return newArr
	}
	/*
	二字联动
	_arr -- 联动数组
	type -- 2:二字操盘
		 -- 3：三字操盘
		 --	4：前四操盘
	*/
	var erziLiandong = function(_arr,_type){
		var newArr = []
		for(var i = 0 ;i < _arr.length; i++){
			if(_type == 3){
				for(var j = 0 ; j < 4; j++){
					var numArr = _arr[i].split('');
					if(numArr[j] != 'x'){
						numArr[j] = 'x';
						if(newArr.indexOf(numArr.join('')) == -1) newArr.push(numArr.join(''))
					}
				}
			}else if(_type == 4){
				for(var j = 0 ; j < 4; j++){
					var numArr = _arr[i].split('');
					numArr[j] = 'x';
					for(var m = j; m < 4; m++){
						if(numArr[m] != 'x'){
							var oldNum = numArr[m];
							numArr[m] = 'x';
							if(newArr.indexOf(numArr.join('')) == -1)  newArr.push(numArr.join(''))
							numArr[m] = oldNum;
						}
					}
				}
			}
			
		}
		return newArr;
	}
	/*
	三字联动
	_arr -- 联动数组
	type -- 2:二字操盘
		 -- 3：三字操盘
		 --	4：前四操盘
	*/
	var sanziLiandong = function(_arr,_type){
		var newArr = [];
		for(var i = 0 ;i < _arr.length; i++){
			if(_type == 2){
				for(var j = 0; j < 4; j++){
					var numArr = _arr[i].split('');
					for(var m= 0; m < 10; m++){
						if(numArr[j] == 'x'){
							numArr[j] = m;
							if(newArr.indexOf(numArr.join('')) == -1) newArr.push(numArr.join(''))
							numArr[j] = 'x';
						}
					}
				}
			}else if(_type == 4){
				for(var j = 0 ; j < 4; j++){
					numArr = _arr[i].split('');
					if(numArr[j] != 'x'){
						numArr[j] = 'x';
						if(newArr.indexOf(numArr.join('')) == -1) newArr.push(numArr.join(''))
					}
				}
			}
		}
		return newArr;
	}
	/*
	前四联动
	_arr -- 联动数组
	type -- 2:二字操盘
		 -- 3：三字操盘
		 --	4：前四操盘
	*/
	var qiansiLiandong = function(_arr,_type){
		var newArr = [];
		for(var i = 0 ;i < _arr.length; i++){
			if(_type == 2){
				for(var m = 0; m < 10; m++){
					for(var n = 0; n < 10; n++){
						var numArr = _arr[i].replace(/x/,m);
						var numArr0 = numArr.replace(/x/,n);
						if(newArr.indexOf(numArr0) == -1) newArr.push(numArr0);
					}
				}
			}else if(_type == 3){
				for(var m = 0; m < 10; m++){
					var numArr = _arr[i].replace(/x/,m);
					if(newArr.indexOf(numArr) == -1) newArr.push(numArr);
				}
			}
		}
		return newArr;
	}
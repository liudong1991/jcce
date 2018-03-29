var exec = require('cordova/exec');

var myFunc = function() {};

//定位
myFunc.prototype.location = function(success, error) {
	exec(success, error, "CommonPL", "location", []);
}

//扫一扫
myFunc.prototype.scan = function(success, error) {
	exec(success, error, "CommonPL", "scan", []);
}

//身份验证
myFunc.prototype.scanIdCard = function(success, error) {
	exec(success, error, "CommonPL", "scanIdCard", []);
}

//读取银行卡
myFunc.prototype.scanBank = function(success, error) {
	exec(success, error, "CommonPL", "scanBank", []);
}

//图片上传
myFunc.prototype.selectImage = function(success, error) {
	exec(success, error, "CommonPL", "selectImage", []);
}

//打电话
myFunc.prototype.telephone = function(phone, success, error) {
	exec(success, error, "CommonPL", "telephone", [phone]);
}

//获取DeviceId、ClientId、ClientVer
myFunc.prototype.getDeviceIdAndClientId = function(success, error) {
	exec(success, error, "CommonPL", "getDeviceIdAndClientId", []);
}

//RSA算法算出 sign签名
myFunc.prototype.getRSA = function(content, success, error) {
	exec(success, error, "CommonPL", "getRSA", [content]);
}

//MD5加密算法
myFunc.prototype.getMD5 = function(content, success, error) {
	exec(success, error, "CommonPL", "getMD5", [content]);
}

//未读消息数量
myFunc.prototype.getUnreadMessageCount = function(success, error) {
	exec(success, error, "CommonPL", "getUnreadMessageCount", []);
}

//消息列表
myFunc.prototype.getMessageList = function(type, pageNum, pageSize, success, error) {
	exec(success, error, "CommonPL", "getMessageList", [type, pageNum, pageSize]);
}

//消息批量删除  ids格式  a,b,c
myFunc.prototype.deleteMessageByBatch = function(ids, success, error) {
	exec(success, error, "CommonPL", "deleteMessageByBatch", [ids]);
}

//设置消息已读
myFunc.prototype.setMessageHasRead = function(id, success, error) {
	exec(success, error, "CommonPL", "setMessageHasRead", [id]);
}

//设置消息已读
myFunc.prototype.test = function(success, error, method, input) {
	exec(success, error, "CommonPL", method, input);
}

var showt = new myFunc();
module.exports = showt;
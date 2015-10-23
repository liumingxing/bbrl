function Ddh_get(attr){
	Ti.include("public.js")
	var win = Titanium.UI.createWindow(attr);
	
	var scrollView = Titanium.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : !Ti.App.is_android ? 'auto' : Ti.App.platform_height,
	
		top : 0,
		bottom : 0,
		left : 0,
		right : 0,
		layout : 'vertical',
	
		showVerticalScrollIndicator : true
	});
	win.add(scrollView)
	
	var image = Ti.UI.createImageView({
		left : 0,
		right: 0,
		top : 2,
		height : __l(145),
		//width : __l(130),
		hires : true,
		image : "http://www.mamashai.com" + encodeURI(win.json.logo_url_thumb260)
	})
	scrollView.add(image)
	
	var tableview = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor : 'transparent',
		rowBackgroundColor : 'white',
		top : __l(2),
		height: __l(320),
		scrollable: false,
		left : 0
	});
	
	var name = Ti.UI.createTableViewRow({
		height : 'auto',
		selectedBackgroundColor : "#E8E8E8",
		header : "留下您的收货信息"
	});
	
	var name_title = Ti.UI.createLabel({
		left : __l(12),
		top : __l(10),
		bottom : __l(8),
		width : __l(100),
		height : 'auto',
		font : {
			fontSize : __l(18)
		},
		color : '#333',
		text : "真实姓名"
	});
	var name_field = Titanium.UI.createTextField({
		height : __l(40),
		top : __l(2),
		bottom : __l(2),
		left : __l(95),
		right : __l(10),
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType : Titanium.UI.RETURNKEY_NEXT,
		font : {
			fontSize : __l(18)
		},
		value: Ti.App.Properties.getString("ddh_name")
	});
	name_field.addEventListener("return", function(e){
		mobile_field.focus();
	})
	
	name.add(name_title)
	name.add(name_field)
	
	var mobile = Ti.UI.createTableViewRow({
		height : 'auto',
		selectedBackgroundColor : "#E8E8E8"
	});
	
	var mobile_title = Ti.UI.createLabel({
		left : __l(12),
		top : __l(10),
		bottom : __l(8),
		width : __l(100),
		height : 'auto',
		font : {
			fontSize : __l(18)
		},
		color : '#333',
		text : "联系电话"
	});
	var mobile_field = Titanium.UI.createTextField({
		height : __l(40),
		top : __l(2),
		bottom : __l(2),
		left : __l(95),
		right : __l(10),
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType : Titanium.UI.RETURNKEY_NEXT,
		font : {
			fontSize : __l(18)
		},
		value: Ti.App.Properties.getString("ddh_mobile"),
		hintText : "手机或座机"
	});
	mobile_field.addEventListener("return", function(e){
		code_field.focus();
	})
	mobile.add(mobile_title)
	mobile.add(mobile_field)
	
	var code = Ti.UI.createTableViewRow({
		height : 'auto',
		selectedBackgroundColor : "#E8E8E8"
	});
	
	var code_title = Ti.UI.createLabel({
		left : __l(12),
		top : __l(10),
		bottom : __l(8),
		width : __l(100),
		height : 'auto',
		font : {
			fontSize : __l(18)
		},
		color : '#333',
		text : "邮编"
	});
	var code_field = Titanium.UI.createTextField({
		height : __l(40),
		top : __l(2),
		bottom : __l(2),
		left : __l(95),
		right : __l(10),
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType : Titanium.UI.RETURNKEY_DONE,
		font : {
			fontSize : __l(18)
		},
		value: Ti.App.Properties.getString("ddh_code"),
		hintText : "邮政编码"
	});
	code_field.addEventListener("return", function(e){
		address_field.focus();
	})
	code.add(code_title)
	code.add(code_field)
	
	var address = Ti.UI.createTableViewRow({
		height : 'auto',
		selectedBackgroundColor : "#E8E8E8"
	});
	
	var address_title = Ti.UI.createLabel({
		left : __l(12),
		top : __l(10),
		bottom : __l(8),
		width : __l(100),
		height : 'auto',
		font : {
			fontSize : __l(18)
		},
		color : '#333',
		text : "收货地址"
	});
	var address_field = Titanium.UI.createTextField({
		height : __l(40),
		top : __l(2),
		bottom : __l(2),
		left : __l(95),
		right : __l(10),
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType : Titanium.UI.RETURNKEY_DONE,
		font : {
			fontSize : __l(18)
		},
		value: Ti.App.Properties.getString("ddh_address"),
		hintText : "精确到门牌号"
	});
	address_field.addEventListener("return", function(e){
		remark_field.focus();
	})
	address.add(address_title)
	address.add(address_field)
	
	
	var remark = Ti.UI.createTableViewRow({
		height : 'auto',
		selectedBackgroundColor : "#E8E8E8"
	});
	
	var remark_title = Ti.UI.createLabel({
		left : __l(12),
		top : __l(10),
		bottom : __l(8),
		width : __l(100),
		height : 'auto',
		font : {
			fontSize : __l(18)
		},
		color : '#333',
		text : "备注"
	});
	var remark_field = Titanium.UI.createTextField({
		height : __l(40),
		top : __l(2),
		bottom : __l(2),
		left : __l(95),
		right : __l(10),
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType : Titanium.UI.RETURNKEY_DONE,
		font : {
			fontSize : __l(18)
		},
		hintText : "比如颜色型号等"
	});
	remark_field.addEventListener("return", function(e){
		remark_field.blur();
	})
	remark.add(remark_title)
	remark.add(remark_field)
	
	var get_row = Ti.UI.createButton({
		title: '提交'
	})
	get_row.addEventListener("click", function(e){
		if (name_field.value == ""){
			show_alert("请填写真实姓名");
			return;
		}
		
		if (mobile_field.value == ""){
			show_alert("请填写联系电话");
			return;
		}
		
		if (address_field.value == ""){
			show_alert("请填写收货地址");
			return;
		}
		
		if (code_field.value == ""){
			show_alert("请填写邮编");
			return;
		}
		
		Ti.App.Properties.setString("ddh_name", name_field.value);
		Ti.App.Properties.setString("ddh_mobile", mobile_field.value);
		Ti.App.Properties.setString("ddh_code", code_field.value);
		Ti.App.Properties.setString("ddh_address", address_field.value);
		
		var xhr = Ti.Network.createHTTPClient()
		xhr.timeout = Ti.App.timeout
		xhr.onerror = function() {
				show_timeout_dlg(xhr, url);
		}
		xhr.onload = function() {
				hide_loading();
				
				if (this.responseText == "ok"){
					if (win.json.score<=5){
						show_alert("提示", "亲，感谢您申请本次试用。活动结束后将通知您是否申请成功，请耐心等候哦！")
					}
					else{
						show_alert("提示", "亲，您的兑换成功，请耐心等快递吧！")
					}
					
					win.close()
					Ti.App.fireEvent("ddh.refresh")
				}
				else if (this.responseText == "repeat"){
					show_alert("提示", "对不起，您已经申请过\"" + win.json.title + "\"。")
				}
				else if (this.responseText == "empty"){
					show_alert("提示", "对不起，您下手晚了，商品已经兑换完了。")
				}
				else{
					show_alert("提示", this.responseText)
				}
		}
		
		var url = Ti.App.mamashai + "/api/statuses/ddh_get/" + win.json.id + "?name=" + name_field.value + "&mobile=" + mobile_field.value + "&code=" + code_field.value + "&address=" + address_field.value + "&remark=" + remark_field.value + "&" + account_str();
		url += "&osname=" + Ti.App.osname + "&version=" + Titanium.App.version + "&appid" + Ti.App.id
		xhr.open('POST', url)
		xhr.send();
		show_loading('正在提交');
	})
	
	if (!Ti.App.is_android)
		win.setRightNavButton(get_row)
	
	tableview.appendRow(name)
	tableview.appendRow(mobile)
	tableview.appendRow(code)
	tableview.appendRow(address)
	tableview.appendRow(remark)
	scrollView.add(tableview)
	
	add_default_action_bar2(win, win.title, "提交", function(){
		get_row.fireEvent("click")
	});
	
	logEvent('ddh_get');
	
	//add_default_action_bar(win, win.title, true)
	return win
}

module.exports = Ddh_get;

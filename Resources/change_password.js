Ti.include("public.js")

var win = Titanium.UI.currentWindow;

var tableview = Titanium.UI.createTableView({
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor:'transparent',
	rowBackgroundColor : 'white',
	scrollble : false
});
win.add(tableview)

group_tableview(tableview)

var old_password = Ti.UI.createTableViewRow({
	height : 'auto',
	selectedBackgroundColor : "#E8E8E8"
});

var label = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(90),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	color: '#333',
	text : "原 密 码："
});
var old_password_field = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(100),
	right : __l(10),
	passwordMask: true,
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	returnKeyType : Titanium.UI.RETURNKEY_NEXT,
	font : {fontSize : __l(18)}
});

old_password_field.addEventListener("return", function(e){
	new_password_field1.focus();
})

old_password.add(label)
old_password.add(old_password_field)

var new_password1 = Ti.UI.createTableViewRow({
	height : 'auto',
	selectedBackgroundColor : "#E8E8E8"
});

var label = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(90),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	color: '#333',
	text : "新 密 码："
});
var new_password_field1 = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(100),
	right : __l(10),
	passwordMask: true,
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	returnKeyType : Titanium.UI.RETURNKEY_NEXT,
	font : {fontSize : __l(18)}
});

new_password_field1.addEventListener("return", function(e){
	new_password_field2.focus();
})

new_password1.add(label)
new_password1.add(new_password_field1)

var new_password2 = Ti.UI.createTableViewRow({
	height : 'auto',
	selectedBackgroundColor : "#E8E8E8"
});

var label = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(100),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	color: '#333',
	text : "再输一遍："
});
var new_password_field2 = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(100),
	right : __l(10),
	passwordMask: true,
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	returnKeyType : Titanium.UI.RETURNKEY_NEXT,
	font : {fontSize : __l(18)}
});

new_password_field2.addEventListener("return", function(e){
	submit_row.fireEvent("click")
})

new_password2.add(label)
new_password2.add(new_password_field2)

var submit_row = Ti.UI.createTableViewRow({
	height : 'auto',
	textAlign : 'center',
	selectedBackgroundColor : "#E8E8E8",
});
var label = Ti.UI.createLabel({
	left : __l(10),
	right : __l(10),
	top : __l(10),
	bottom : __l(8),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	textAlign : 'center',
	color: '#333',
	text : "提交"
});
submit_row.add(label)

tableview.appendRow(old_password)
tableview.appendRow(new_password1)
tableview.appendRow(new_password2)
tableview.appendRow(submit_row)

submit_row.addEventListener("click", function(e){
	if (old_password_field.value != Ti.App.Properties.getString("password", "aaaaaa")){
		show_alert("提示", "原密码输入不正确")
		return;
	}
	
	if (new_password_field1.value == ""){
		show_alert("提示", "请输入新密码");
		return;
	}
	if (new_password_field1.value.length < 6){
		show_alert("提示", "新密码至少6位");
		return;
	}
	
	if (new_password_field1.value != new_password_field2.value){
		show_alert("提示", "对不起，两次密码输入不一致");
		return;
	}
	
	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function() {
			hide_loading();
			show_notice("修改密码失败，网络不给力")
	}
	xhr.onload = function() {
			var result = this.responseText;
			if (result == "ok"){
				win.close()
				show_notice("修改密码成功")	
			}
			else{
				show_notice("对不起，修改密码失败")
			}
	}
	var url = Ti.App.mamashai + "/api/account/change_password?new_password="+new_password_field1.value+"&" + account_str()
	xhr.open("POST", url)
	xhr.send()
})

add_default_action_bar(win, win.title, true)

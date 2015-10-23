Ti.include("public.js");
var win = Titanium.UI.currentWindow;

var b = Titanium.UI.createButton({
	title : '关闭',
});
if (!Ti.App.is_android)
	win.setRightNavButton(b);

b.addEventListener('click', function() {
	win.close();
});

var navActInd = Titanium.UI.createActivityIndicator();
Titanium.UI.currentWindow.setLeftNavButton(navActInd);

var scroll_view = Titanium.UI.createScrollView({
	contentWidth : 'auto',
	contentHeight : 'auto',
	top : 0,
	bottom : 0
});
win.add(scroll_view)

var tableview = Titanium.UI.createTableView({
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor : 'transparent',
	rowBackgroundColor : 'white',
	scrollble : false
});
if (Ti.App.is_android)
	tableview.height = __l(266)

var section1 = Titanium.UI.createTableViewSection();
var section2 = Titanium.UI.createTableViewSection();


group_tableview(tableview)

scroll_view.add(tableview)

var email = Ti.UI.createTableViewRow({
	height : 'auto',
	selectedBackgroundColor : "#E8E8E8"
});

var email_title = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(80),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	color: "#333",
	text : "登录帐号"
});
var email_field = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(98),
	right : __l(20),
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	font : {fontSize : __l(18)},
	returnKeyType : Titanium.UI.RETURNKEY_NEXT,
	hintText : "电子邮件地址"
});
email_field.addEventListener("return", function(e){
	name_field.focus();
})
email.add(email_title);
email.add(email_field);
section1.add(email)

var name = Ti.UI.createTableViewRow({
	height : 'auto',
	selectedBackgroundColor : "#E8E8E8"
});

var name_title = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(80),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	color: "#333",
	text : "用户昵称"
});
var name_field = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(98),
	right : __l(20),
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	returnKeyType : Titanium.UI.RETURNKEY_NEXT,
	font :{fontSize : __l(18)},
	hintText : "您在站内显示的名字"
});
name_field.addEventListener("return", function(e){
	password_field.focus();
})
name.add(name_title);
name.add(name_field);
section1.add(name)

var password = Ti.UI.createTableViewRow({
	height : 'auto',
	selectedBackgroundColor : "#E8E8E8"
});

var password_title = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(80),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	color: "#333",
	text : "登录密码"
});
var password_field = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(98),
	right : __l(20),
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	returnKeyType : Titanium.UI.RETURNKEY_NEXT,
	font :{fontSize : __l(18)},
	passwordMask : true,
	hintText : "登录密码，至少6位"
});
password_field.addEventListener("return", function(e){
	password_again_field.focus();
})
password.add(password_title);
password.add(password_field);
section1.add(password)

var password_again = Ti.UI.createTableViewRow({
	height : 'auto',
	selectedBackgroundColor : "#E8E8E8"
});

var password_again_title = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(80),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	color: "#333",
	text : "密码确认"
});
var password_again_field = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(98),
	right : __l(20),
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	returnKeyType : Titanium.UI.RETURNKEY_NEXT,
	passwordMask : true,
	font : {fontSize : __l(18)},
	hintText : "再输一遍登录密码"
});
password_again_field.addEventListener("return", function(e){
	//gender_field.fireEvent("click")
})
password_again.add(password_again_title);
password_again.add(password_again_field);
section1.add(password_again)

gender = Ti.UI.createTableViewRow({
	height : Ti.UI.SIZE
});
var gender_title = Ti.UI.createLabel({
	left : __l(12),
	top : __l(10),
	bottom : __l(8),
	width : __l(80),
	height : Ti.UI.SIZE,
	font : {
		fontSize : __l(18)
	},
	color: "#333",
	text : "我的身份"
});

var gender_field = Titanium.UI.createTextField({
	height : __l(40),
	top : __l(2),
	bottom : __l(2),
	left : __l(98),
	right : __l(20),
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
	font : {fontSize : __l(18)},
	enabled : false,
	editable: false,
	hintText : "爸爸？妈妈？"
});
if (Ti.App.is_android)
	gender_field.enabled = true

function gender_click() {
	email_field.blur();
	password_field.blur();
	password_again_field.blur();
	gender_field.blur();
	
	var PickerView = require('lib/picker_view')
	var picker_view = PickerView.create_picker_view(picker, function() {
	})
	win.add(picker_view)
	picker_view.animate(PickerView.picker_slide_in);

	//导致change事件触发，所以注释
	picker.no_event = true;
	gender_field.value = "妈妈"
	gender_field.back_value = "w"
	if(gender_field.value == "妈妈") {
		picker.setSelectedRow(0, 0, true);
	} else if(gender_field.value == "爸爸") {
		picker.setSelectedRow(0, 1, false);
	}
}
gender_field.addEventListener("click", gender_click)
gender_field.addEventListener("focus", gender_click)

gender.add(gender_title)
gender.add(gender_field)

section1.add(gender)

var register_row = Ti.UI.createTableViewRow({
	height : 'auto',
	header : '',
	textAlign : 'center',
	selectedBackgroundColor : "#E8E8E8",
});
var register_title = Ti.UI.createLabel({
	left : __l(10),
	right : __l(10),
	top : __l(10),
	bottom : __l(8),
	height : 'auto',
	font : {
		fontSize : __l(18)
	},
	textAlign : 'center',
	color: "#333",
	text : "注册"
});
register_row.add(register_title)
section2.add(register_row)

tableview.data = [section1, section2]

var picker = Titanium.UI.createPicker({
	useSpinner: true,
	selectionIndicator : true,
	width: Ti.App.platform_width,
	visibleItems: 7
});
if (Ti.App.is_android && Ti.App.platform_width == 480){
		picker.visibleItems = 5;
}
var data = [];
data[0]=Ti.UI.createPickerRow({title:'妈妈',custom_item:'w'});
data[1]=Ti.UI.createPickerRow({title:'爸爸',custom_item:'m'});
var column1 = Ti.UI.createPickerColumn({rows: data});
if (Ti.App.is_android){
	column1.width = Ti.App.platform_width;
}
picker.add(column1);
picker.addEventListener('change',function(e)
{		
	gender_field.value = e.row.title;
	gender_field.back_value = e.row.custom_item;
});

var doing = false;
register_row.addEventListener("click", function() {
	if(doing == true)
		return;

	if(!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email_field.value)) {
		show_alert("注册失败", "请填写正确的邮件地址")
		return
	}

	if(name_field.value.length == 0) {
		show_alert("注册失败", "对不起，请您填写昵称")
		return
	}

	if(password_field.value.length < 6) {
		show_alert("注册失败", "对不起，您的密码少于6位")
		return
	}

	if(password_field.value != password_again_field.value) {
		show_alert("注册失败", "对不起，两次密码验证不一致")
		return
	}
	
	if(gender_field.value.length == 0) {
		show_alert("注册失败", "对不起，您还没选择身份呢")
		return
	}

	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function() {
			hide_loading();
			
			show_alert("提示", "网络链接超时")
	}
	xhr.onload = function() {
			navActInd.hide();
			doing = false;

			if(this.responseText[0] == '[') {
				var json = JSON.parse(this.responseText)
				var str = "";
				for(var i = 0; i < json.length; i++) {
					str += json[i][1] + "\n"
				}
				show_alert('注册失败', str)
				return;
			}

			var json = JSON.parse(this.responseText);
			Ti.App.Properties.setString("userid", json.id);
			Ti.App.Properties.setString("email", json.email);
			Ti.App.Properties.setString("name", json.name);
			Ti.App.Properties.setString("password", password_field.value);
			Ti.App.Properties.setString("gender", json.gender);
			Ti.App.Properties.setString("user_kids", json.user_kids);
			Ti.App.Properties.setString("token", "");
			Ti.App.Properties.setString("secret", "");
			Ti.App.Properties.setString("token_type", "");
			Ti.App.Properties.setString("expire_at", "");

			require('lib/mamashai_db').db.insert_json("user_profile", json.id, JSON.stringify(json))

			win.close();

			show_notice("注册成功！")
			Ti.App.fireEvent("new_register");
	}
	xhr.open('POST', Ti.App.mamashai + "/api/account/signup?from=baby_calendar&email=" + email_field.value + "&name=" + name_field.value + "&password=" + password_field.value + "&password_confirmation=" + password_again_field.value + "&gender=" + gender_field.back_value);
	xhr.send();

	navActInd.show();
})

logEvent('register');

add_default_action_bar(win, win.title, true)

function LoginMamashai(attr){
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	
	var tableview = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		top: 0,
		//style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
		//backgroundColor : 'white',
		backgroundColor:'transparent',
		rowBackgroundColor : 'white',
		scrollble : false
	});
	
	if (Ti.App.is_android){
		tableview.height = __l(200);
	}
	
	var user = Ti.UI.createTableViewRow({
		height : 'auto',
		selectedBackgroundColor : "#E8E8E8"
	});
	
	var user_title = Ti.UI.createLabel({
		left : __l(12),
		top : __l(0),
		bottom : __l(0),
		width : __l(50),
		height : __l(44),
		font : {
			fontSize : __l(18)
		},
		color: '#333',
		text : "帐号"
	});
	var email_field = Titanium.UI.createTextField({
		height : __l(40),
		top : Ti.App.is_android ? __l(6) : __l(2),
		bottom : __l(2),
		left : __l(60),
		right : __l(10),
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType : Titanium.UI.RETURNKEY_NEXT,
		font : {fontSize : __l(18)},
		hintText : "电子邮件地址"
	});
	
	email_field.addEventListener("return", function(e){
		password_field.focus();
	});
	
	user.add(user_title);
	user.add(email_field);
	tableview.appendRow(user);
	
	var password = Ti.UI.createTableViewRow({
		height : 'auto',
		selectedBackgroundColor : "#E8E8E8",
	});
	
	var password_title = Ti.UI.createLabel({
		left : __l(12),
		top : __l(0),
		bottom : __l(0),
		width : __l(50),
		height : __l(44),
		font : {
			fontSize : __l(18)
		},
		color: '#333',
		text : "密码"
	});
	var password_field = Titanium.UI.createTextField({
		height : __l(40),
		top : Ti.App.is_android ? __l(6) : __l(2),
		bottom : __l(2),
		left : __l(60),
		right : __l(10),
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType : Titanium.UI.RETURNKEY_DONE,
		font : {fontSize : __l(18)},
		passwordMask : true,
		hintText : "登录密码"
	});
	
	password_field.addEventListener("return", function(e){
		password_field.blur();
		if (!Ti.App.is_android){
			setTimeout(function(e){
				login_btn.fireEvent("click")
			}, 500)
		}
		else{
			login_btn.fireEvent("click")
		}
	});
	
	password.add(password_title);
	password.add(password_field);
	tableview.appendRow(password);
	
	var login_row2 = Ti.UI.createTableViewRow({
		height : __l(60),
		textAlign : 'center',
	});
	var login_btn = Ti.UI.createButton({
		top: __l(10),
		height: __l(40),
		//left: __l(10),
		//right: __l(10),
		title: "登 录",
		font: {fontSize: __l(18)},
		width: (Ti.App.platform_width - __l(80))/2
	});
	pre_btn(login_btn);
	login_btn.backgroundImage = '/images/android_btn_3.jpg';
	login_btn.backgroundSelectedImage = "/images/android_btn_4.jpg";
	login_btn.color = "white";
	login_row2.add(login_btn);
	
	login_btn.addEventListener('click', function() {
		var xhr = Ti.Network.createHTTPClient()
		xhr.timeout = Ti.App.timeout
		xhr.onerror = function() {
				hide_loading();
				
				show_alert("提示", "网络连接超时")
		}
		xhr.onload = function() {
				var res = this.responseText;
				if(res == "error" || res.length == 0) {
					hide_loading();
					show_alert("提示", "帐号或密码错误")
					return;
				} else {
					var json = JSON.parse(res);
					Ti.App.Properties.setString("userid", json.id);
					Ti.App.Properties.setString("email", json.email);
					Ti.App.Properties.setString("name", json.name);
					Ti.App.Properties.setString("password", password_field.value);
					Ti.App.Properties.setString("gender", json.gender);
					Ti.App.Properties.setString("user_kids", json.user_kids);
					//Ti.App.Properties.setString("token", json.token);
					Ti.App.Properties.setString("token", '');
					Ti.App.Properties.setString("secret", "");
					Ti.App.Properties.setString("token_type", "");
					Ti.App.Properties.setString("expire_at", "");
	
					require('lib/mamashai_db').db.insert_json("user_profile", json.id, JSON.stringify(json));
				}
				
				hide_loading();
				
				win.close();
				
				Ti.App.fireEvent("sina_login");
		};
		xhr.open('POST', Ti.App.mamashai + "/api/account/login?email=" + email_field.value + "&password=" + password_field.value);
		xhr.send();
	
		show_loading();
	});
	
	tableview.appendRow(login_row2);
	
	var forget_row = Ti.UI.createTableViewRow({
		height : __l(41),
		hasChild : false,
		selectedBackgroundColor : "white",
	});
	var forget_title = Ti.UI.createLabel({
		right : __l(6),
		top : __l(0),
		align: 'right',
		//bottom : __l(10),
		height: __l(41),
		width: __l(100),
		font : {
			fontSize : __l(13)
		},
		color: '#999',
		text : "忘记了密码？"
	});
	forget_title.addEventListener("click", function(e){
		show_alert("提示", "亲，请您添加客服QQ1170979903进行咨询。");
	});
	forget_row.add(forget_title);
	
	tableview.appendRow(forget_row);
	
	win.add(tableview);
	
	add_default_action_bar(win, win.title, true);
	
	return win;
}

module.exports = LoginMamashai;
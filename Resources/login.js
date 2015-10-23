function Login(attr){
	Ti.include("public.js");
	
	var win = Titanium.UI.createWindow(attr);
	
	var wrapper = Ti.UI.createView({
		top: __l(0),
		layout: 'horizontal',
		width: Ti.App.platform_width > __l(370) ? __l(360) : __l(280),
		left: Ti.App.platform_width > __l(370) ? (Ti.App.platform_width - __l(360))/2 : (Ti.App.platform_width - __l(280))/2,
		right: 0
	});
	win.add(wrapper);
	
	var button = Ti.UI.createButton({
		title: "妈妈晒用户协议",
		bottom: __l(16),
		width: __l(120),
		height: __l(30),
		font: {fontSize: __l(14)},
		left: (Ti.App.platform_width - __l(120))/2
	});
	if (Ti.App.is_android)
		pre_btn(button);
	button.addEventListener("click", function(e){
		Ti.App.fireEvent("open_url", {
			url: "http://www.mamashai.com/html/agreement.html"
		});
	});
	win.add(button);
	function add_btn(image, text, click){
		var logo_wrapper = Ti.UI.createView({
			width: Ti.App.platform_width > __l(370) ? __l(120) : __l(140),
			height: __l(100),
			top: __l(20)
		});
		var button = Ti.UI.createButton({
			top: 0,
			backgroundImage: image + ".png",
			backgroundSelectedImage : image + "-d.png",
			height: __l(70),
			width: __l(70),
		});
		button.addEventListener("click", function(e){
			click(e);
		});
		logo_wrapper.add(button);
		logo_wrapper.add(Ti.UI.createLabel({
			text: text,
			left: 0,
			right: 0,
			top: __l(80),
			textAlign: 'center',
			color: "#333",
			font: {fontSize: __l(15)}
		}));
		wrapper.add(logo_wrapper);
	}
	
	var tiwechat = require('com.mamashai.tiwechat');
	if (tiwechat.isWeixinInstalled() == "yes"){
		add_btn("/images/login/weixin", "微信", function(e){
			tiwechat.exampleProp = Ti.App.wechat_key;
			tiwechat.loginWeixin(user_id());
		});
	}
	
	
	add_btn("/images/login/qq", "QQ", function(e){
		show_window("qzone.js", {
			title: "QQ账号登录",
		});
	});
	
	add_btn("/images/login/sina", "微博", function(e){
		show_window("sina.js", {
			title: "新浪微博账号登录",
		});
	});
	
	add_btn("/images/login/tencent", "腾讯微博", function(e){
		show_window("tencent.js", {
			title: "腾讯微博账号登录",
		});
	});
	
	add_btn("/images/login/taobao", "淘宝", function(e){
		show_window("taobao.js", {
			title: "淘宝账号登录",
		});
	});
	
	add_btn("/images/login/mamashai", "妈妈晒", function(e){
		show_window("login_mamashai", {
			title: "妈妈晒账号登录",
		});
	});
	
	add_default_action_bar(win, win.title, true);
	
	function ios_resumed(e){
		var url = '';
		if (Ti.App.is_android){
			url = Ti.App.mamashai + "/api/account/login_by_weixin/" + user_id() + "?key=" + Ti.App.wechat_key + "&code=" + Ti.App.Properties.getString('w_code', '');
		}
		else{
			if (e.url && e.url.indexOf("auth") > 0){
				url = Ti.App.mamashai + "/api/account/login_by_weixin/?url=" + encodeURI(e.url);
			}
			else{
				return;
			}
		}
		
		http_call(url, function(e){
					json = JSON.parse(e.responseText);
					if (json.errmsg){
						show_alert("提示", json.errmsg);
						return;
					}
					Ti.App.Properties.setString("userid", json.id);
					Ti.App.Properties.setString("email", json.email);
					Ti.App.Properties.setString("name", json.name);
					Ti.App.Properties.setString("gender", json.gender);
					Ti.App.Properties.setString("user_kids", json.user_kids);
					//Ti.App.Properties.setString("token", json.token);
					Ti.App.Properties.setString("weixin_token", json.email);
					Ti.App.Properties.setString("weixin_secret", "");
					Ti.App.Properties.setString("token_type", "weixin");
					Ti.App.Properties.setString("expire_at", "");
					
					require('lib/mamashai_db').db.insert_json("user_profile", json.id, JSON.stringify(json));
					
					win.close();
	
					show_notice("登录成功");
					Ti.App.fireEvent("logged_in");
		
					Ti.App.fireEvent("register_notify");
			});
	}
	Ti.App.addEventListener("ios_resumed", ios_resumed);
	win.addEventListener("close", function(e){
		Ti.App.removeEventListener("ios_resumed", ios_resumed);
	});
	win.addEventListener("focus", function(e){
		var now = new Date();
		
		//小于3秒
		if (now.getTime() - parseInt(Ti.App.Properties.getString('w_occur_at', '')) < 3000){
			Ti.App.fireEvent("ios_resumed");
		}
	});
	
	function taobao_login(e){
		if (Ti.App.is_android){
			Ti.App.fireEvent("logged_in");
			Ti.App.fireEvent("register_notify");
		}
		
		win.close();
		show_notice("登录成功!");
		
		if (!Ti.App.is_android){
			setTimeout(function(){
				Ti.App.fireEvent("logged_in");
				Ti.App.fireEvent("register_notify");
			}, 800);
		}
	}
	function sina_login(e) {
		if (Ti.App.is_android){
			Ti.App.fireEvent("logged_in");
			Ti.App.fireEvent("register_notify");
		}
		
		win.close();
		show_notice("登录成功!");
		
		if (!Ti.App.is_android){
			setTimeout(function(){
				Ti.App.fireEvent("logged_in");
				Ti.App.fireEvent("register_notify");
			}, 800);
		}
	}
	function weixin_login(e){
		if (Ti.App.is_android){
			Ti.App.fireEvent("logged_in");
			Ti.App.fireEvent("register_notify");
		}
		
		win.close();
		show_notice("登录成功!");
		
		if (!Ti.App.is_android){
			setTimeout(function(){
				Ti.App.fireEvent("logged_in");
				Ti.App.fireEvent("register_notify");
			}, 800);
		}
	}
	function qzone_login(e) {
		if (Ti.App.is_android){
			Ti.App.fireEvent("logged_in");
			Ti.App.fireEvent("register_notify");
		}
		
		win.close();
		show_notice("登录成功!");
		
		if (!Ti.App.is_android){
			setTimeout(function(){
				Ti.App.fireEvent("logged_in");
				Ti.App.fireEvent("register_notify");
			}, 800);
		}	
	}
	function new_register(e) {
		if (Ti.App.is_android){
			Ti.App.fireEvent("logged_in");
			Ti.App.fireEvent("register_notify");
		}
		
		win.close();
		
		if (!Ti.App.is_android){
			setTimeout(function(){
				Ti.App.fireEvent("logged_in");
				Ti.App.fireEvent("register_notify");
			}, 800);
		}
	}
	function tencent_login(e) {
		if (Ti.App.is_android){
			Ti.App.fireEvent("logged_in");
			Ti.App.fireEvent("register_notify");
		}
		
		win.close();
		show_notice("登录成功!");
		
		if (!Ti.App.is_android){
			setTimeout(function(){
				Ti.App.fireEvent("logged_in");
				Ti.App.fireEvent("register_notify");
		}, 800);
		}
	}
	function set_invite (e){
		var user_record = require('/lib/mamashai_db').db.select_one_json("user_profile", user_id());
		var user_json = JSON.parse(user_record.json);
		if (user_json.user_kids.length == 0){
			show_window("profile_kid.js", {
				title : "宝宝资料录入",
				from_write: true,
				json : {},
			});	
		}
	}
		
	Titanium.App.addEventListener('taobao_login', taobao_login);
	Titanium.App.addEventListener('sina_login', sina_login);
	Titanium.App.addEventListener('weixin_login', weixin_login);
	Titanium.App.addEventListener('qzone_login', qzone_login);
	Titanium.App.addEventListener('new_register', new_register);
	Titanium.App.addEventListener('tencent_login', tencent_login);
	Titanium.App.addEventListener("logged_in", set_invite);
	
	win.addEventListener("close", function(){
		Titanium.App.removeEventListener('taobao_login', taobao_login);
		Titanium.App.removeEventListener('sina_login', sina_login);
		Titanium.App.removeEventListener('weixin_login', weixin_login);
		Titanium.App.removeEventListener('qzone_login', qzone_login);
		Titanium.App.removeEventListener('new_register', new_register);
		Titanium.App.removeEventListener('tencent_login', tencent_login);
		Titanium.App.removeEventListener('logged_in', set_invite);
	});
	
	return win;
}

module.exports = Login;

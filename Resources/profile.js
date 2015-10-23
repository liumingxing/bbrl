function Profile(attr) {
	Ti.include("public.js");

	var win = Titanium.UI.createWindow(attr);

	//是否显示修改密码按钮
	var password = Ti.App.Properties.getString("password", "");
	if (password != "") {
		var change_password = Titanium.UI.createButton({
			title : '修改密码'
		});
		change_password.addEventListener("click", function(e) {
			show_window("change_password.js", {
				title : "修改登录密码"
			});
		});
		if (Ti.App.is_android) {
			add_default_action_bar2(win, win.title, "修改密码", function() {
				change_password.fireEvent("click");
			});
		} else
			win.setRightNavButton(change_password);
	} else {
		add_default_action_bar(win, win.title, true);
	}

	var table_header = Ti.UI.createView({
		height : __l(20)
	});
	var tableview = Titanium.UI.createTableView({
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		top : 0,
		zIndex : -1,
		left: 0,
		right: 0,
		bottom : 0,
		backgroundColor : "#F4F6F1",
		headerView : table_header,
	});

	win.add(tableview);

	function make_profile_table_view(json) {
		var section1 = Ti.UI.createTableViewSection();
		
		var logo_row = Ti.UI.createTableViewRow({
			height : __l(44),
			backgroundColor : "white",
			selectedBackgroundColor : "#E8E8E8"
		});

		var user_logo = Ti.UI.createImageView({
			top : __l(6),
			bottom : __l(6),
			right : __l(20),
			width : __l(32),
			height : __l(32),
			image : "./images/default.gif",
			defaultImage : "./images/default.gif",
			hires : true
		});
		var user_logo_tip = Ti.UI.createLabel({
			left : __l(16),
			top : Ti.App.is_android ? __l(12) : __l(14),
			bottom : __l(12),
			width : __l(80),
			font : {
				fontSize : __l(16)
			},
			color : "#333",
			text : "头像"
		});
		logo_row.add(user_logo);
		logo_row.add(user_logo_tip);

		logo_row.addEventListener("click", function() {
			select_image(true, function(image, path) {
				user_logo.file = image;
				user_logo.image = image;

				if (Ti.App.is_android) {
					logo_row.remove(user_logo);
					logo_row.add(user_logo);
				}
			});
		});

		var name = Ti.UI.createTableViewRow({
			height : __l(44),
			backgroundColor : "white",
			selectedBackgroundColor : "#E8E8E8"
		});
		name.addEventListener("click", function(e) {
			name_field.focus();
		});

		var name_title = Ti.UI.createLabel({
			left : __l(16),
			top : Ti.App.is_android ? __l(12) : __l(14),
			bottom : __l(12),
			width : __l(80),
			font : {
				fontSize : __l(16)
			},
			color : "#333",
			returnKeyType : Titanium.UI.RETURNKEY_DONE,
			text : "昵称"
		});
		var name_field = Titanium.UI.createTextField({
			height : Ti.App.is_android ? __l(40) : __l(18),
			top : Ti.App.is_android ? __l(2) : __l(14),
			bottom : Ti.App.is_android ? __l(2) : __l(12),
			left : __l(100),
			right : __l(20),
			maxLength : 16,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
			value : json.name,
			textAlign : 'right',
			font : {
				fontSize : __l(16)
			}
		});

		name.add(name_title);
		name.add(name_field);

		/////////////身份/////////////
		gender = Ti.UI.createTableViewRow({
			height : __l(44),
			backgroundColor : "white",
			selectedBackgroundColor : "#E8E8E8"
		});
		var gender_title = Ti.UI.createLabel({
			left : __l(16),
			top : Ti.App.is_android ? __l(12) : __l(14),
			bottom : __l(12),
			width : __l(80),
			font : {
				fontSize : __l(16)
			},
			color : "#333",
			text : "身份"
		});
		var column1 = Ti.UI.createPickerColumn({
			font : {
				fontSize : __l(16)
			}
		});
		column1.addRow(Ti.UI.createPickerRow({
			title : '妈妈',
			custom_item : 'w'
		}));
		column1.addRow(Ti.UI.createPickerRow({
			title : '爸爸',
			custom_item : 'm'
		}));
		var gender_picker_android = Ti.UI.createPicker({
			top : __l(10),
			right : __l(20),
			width : Ti.UI.SIZE,
			font : {
				fontSize : __l(16)
			},
			columns : [column1],
			value : json.gender
		});
		if (json.gender == 'm') {
			gender_picker_android.setSelectedRow(0, 1, true);
		}
		gender_picker_android.addEventListener("change", function(e) {
			gender_picker_android.value = e.row.custom_item;
		})
		var gender_field = Titanium.UI.createTextField({
			height : Ti.App.is_android ? __l(40) : __l(18),
			top : Ti.App.is_android ? __l(2) : __l(14),
			bottom : Ti.App.is_android ? __l(2) : __l(12),
			left : __l(100),
			right : __l(20),
			value : "",
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
			font : {
				fontSize : __l(16)
			},
			enabled : false,
			textAlign : 'right',
			editable : false
		});

		function picker_click() {
			gender_field.blur();

			var PickerView = require('lib/picker_view')
			var picker_view = PickerView.create_picker_view(gender_picker, function() {

			});
			win.add(picker_view)
			picker_view.animate(PickerView.picker_slide_in);

			//导致change事件触发，所以注释
			gender_picker.no_event = true;
			if (gender_field.value == "妈妈") {
				gender_picker.setSelectedRow(0, 0, true);
			} else if (gender_field.value == "爸爸") {
				gender_picker.setSelectedRow(0, 1, false);
			}
		}


		gender_field.addEventListener("click", picker_click);
		gender_field.addEventListener("focus", picker_click);

		/////////城市/////////////
		var city_row = Ti.UI.createTableViewRow({
			height : __l(44),
			selectedBackgroundColor : "#E8E8E8",
			backgroundColor : "white",
			hasChild : Ti.App.is_android ? false : true,
		});
		var w1 = Ti.UI.createView({
			top : 0,
			left : 0,
			bottom : 0,
			width : Ti.UI.SIZE,
			touchEnabled : false
		});
		w1.add(Ti.UI.createLabel({
			left : __l(16),
			top : Ti.App.is_android ? __l(12) : __l(14),
			bottom : __l(12),
			width : Ti.UI.SIZE,
			touchEnabled : false,
			font : {
				fontSize : __l(16)
			},
			color : "#333",
			text : "城市"
		}));
		city_row.add(w1);
		if (Ti.App.is_android) {
			city_row.add(Ti.UI.createImageView({
				top : __l(12),
				bottom : __l(12),
				height : __l(20),
				width : __l(20),
				right : __l(6),
				touchEnabled : false,
				image : "/images/table_right.png"
			}));
		}
		var w2 = Ti.UI.createView({
			top : 0,
			right : 0,
			bottom : 0,
			width : Ti.UI.SIZE,
			touchEnabled : false
		});
		var city_label = Ti.UI.createLabel({
			right : Ti.App.is_android ? __l(40) : __l(2),
			font : {
				fontSize : __l(16)
			},
			color : "#333",
			textAlign : 'right',
			top : Ti.App.is_android ? __l(12) : __l(14),
			bottom : __l(12),
			touchEnabled : false,
			width : Ti.UI.SIZE,
			text : json.province_name || json.city_name ? (json.province_name || '') + (json.city_name || '') : "未填"
		});
		w2.add(city_label);
		city_row.add(w2);
		city_row.addEventListener("click", function(e) {
			show_window("city", {
				title : "选择省份",
				s_province : json.province_name,
				s_city : json.city_name,
				backgroundColor : 'white'
			});
		});
		function change_city(e) {
			city_label.text = e.province_name + " " + e.city_name;
			var url = Ti.App.mamashai + "/api/account/update_profile?city=" + e.city_id + "&province=" + e.province_id + "&" + account_str();
			http_call(url, function(e) {
				require('lib/mamashai_db').db.insert_json("user_profile", user_id(), e.responseText);
				show_notice("修改城市成功");
			});
		}


		Ti.App.addEventListener("select_city", change_city);
		win.addEventListener("close", function(e) {
			Ti.App.removeEventListener("select_city", change_city);
		});

		////////////账号绑定///////////////
		var weixin_row = Ti.UI.createTableViewRow({
			height : __l(44),
			selectedBackgroundColor : "#E8E8E8",
			backgroundColor : "white",
			hasChild : Ti.App.is_android ? false : true,
			json : {}
		});

		if (Ti.App.is_android) {
			weixin_row.add(Ti.UI.createImageView({
				top : __l(12),
				bottom : __l(12),
				height : __l(20),
				width : __l(20),
				right : __l(6),
				touchEnabled : false,
				image : "/images/table_right.png"
			}));
		}

		weixin_row.addEventListener("click", function(e) {
			var PickerView = require('lib/picker_view');
			picker = Titanium.UI.createTableView({
				top : Ti.App.is_android ? __l(40) : 143,
				no_cancel : true,
				ok_string : "关闭",
				label : '可用以下第三方账号登录',
			});

			var weixin = Ti.UI.createTableViewRow({
				height : Ti.UI.SIZE,
				backgroundColor : "white",
				selectedBackgroundColor : "#E8E8E8"
			});
			if (weixin_row.json.weixin) {
				weixin.hasCheck = true;
				weixin.backgroundColor = "#fee";
			}

			var tiwechat = require('com.mamashai.tiwechat');
			weixin.addEventListener("click", function(e) {
				tiwechat.exampleProp = Ti.App.wechat_key;
				tiwechat.loginWeixin(user_id());
				picker_view.animate(PickerView.picker_slide_out);
			});

			weixin.add(Ti.UI.createImageView({
				left : __l(20),
				top : __l(6),
				bottom : __l(6),
				height : __l(28),
				width : __l(28),
				touchEnabled : false,
				image : "/images/login/bind_weixin.png"
			}));
			weixin.add(Ti.UI.createLabel({
				text : "微信",
				left : __l(70),
				color : "#333",
				touchEnabled : false,
				font : {
					fontSize : __l(15)
				}
			}));
			if (tiwechat.isWeixinInstalled() == "yes")
				picker.appendRow(weixin);

			var qq = Ti.UI.createTableViewRow({
				height : Ti.UI.SIZE,
				backgroundColor : "white",
				selectedBackgroundColor : "#E8E8E8"
			});
			if (weixin_row.json.qq) {
				qq.hasCheck = true;
				qq.backgroundColor = "#fee";
			}

			qq.addEventListener("click", function(e) {
				show_window("qzone.js", {
					title : "绑定QQ",
					id : user_id()
				});
				picker_view.animate(PickerView.picker_slide_out);
			});
			qq.add(Ti.UI.createImageView({
				left : __l(20),
				top : __l(6),
				bottom : __l(6),
				height : __l(28),
				width : __l(28),
				touchEnabled : false,
				image : "/images/login/bind_qq.png"
			}));
			qq.add(Ti.UI.createLabel({
				text : "QQ",
				left : __l(70),
				color : "#333",
				touchEnabled : false,
				font : {
					fontSize : __l(15)
				}
			}));
			picker.appendRow(qq);

			var weibo = Ti.UI.createTableViewRow({
				height : Ti.UI.SIZE,
				backgroundColor : "white",
				selectedBackgroundColor : "#E8E8E8"
			});
			if (weixin_row.json.weibo) {
				weibo.hasCheck = true;
				weibo.backgroundColor = "#fee";
			}

			weibo.addEventListener("click", function(e) {
				show_window("sina.js", {
					title : "绑定微博",
					id : user_id()
				});
				picker_view.animate(PickerView.picker_slide_out);
			});
			weibo.add(Ti.UI.createImageView({
				left : __l(20),
				top : __l(6),
				bottom : __l(6),
				height : __l(28),
				width : __l(28),
				touchEnabled : false,
				image : "/images/login/bind_sina.png"
			}));
			weibo.add(Ti.UI.createLabel({
				text : "微博",
				left : __l(70),
				color : "#333",
				touchEnabled : false,
				font : {
					fontSize : __l(15)
				}
			}));
			picker.appendRow(weibo);

			var tencent = Ti.UI.createTableViewRow({
				height : Ti.UI.SIZE,
				backgroundColor : "white",
				selectedBackgroundColor : "#E8E8E8"
			});
			if (weixin_row.json.tencent) {
				tencent.hasCheck = true;
				tencent.backgroundColor = "#fee";
			}

			tencent.addEventListener("click", function(e) {
				show_window("tencent.js", {
					title : "绑定腾讯微博",
					id : user_id()
				});
				picker_view.animate(PickerView.picker_slide_out);
			});
			tencent.add(Ti.UI.createImageView({
				left : __l(20),
				top : __l(6),
				bottom : __l(6),
				height : __l(28),
				width : __l(28),
				touchEnabled : false,
				image : "/images/login/bind_tencent.png"
			}));
			tencent.add(Ti.UI.createLabel({
				text : "腾讯微博",
				left : __l(70),
				color : "#333",
				touchEnabled : false,
				font : {
					fontSize : __l(15)
				}
			}));
			picker.appendRow(tencent);

			var taobao = Ti.UI.createTableViewRow({
				height : Ti.UI.SIZE,
				backgroundColor : "white",
				selectedBackgroundColor : "#E8E8E8"
			});
			if (weixin_row.json.taobao) {
				taobao.hasCheck = true;
				taobao.backgroundColor = "#fee";
			}

			taobao.addEventListener("click", function(e) {
				show_window("taobao.js", {
					title : "绑定淘宝",
					id : user_id()
				});
				picker_view.animate(PickerView.picker_slide_out);
			});
			taobao.add(Ti.UI.createImageView({
				left : __l(20),
				top : __l(6),
				bottom : __l(6),
				height : __l(28),
				width : __l(28),
				touchEnabled : false,
				image : "/images/login/bind_taobao.png"
			}));
			taobao.add(Ti.UI.createLabel({
				text : "淘宝",
				left : __l(70),
				color : "#333",
				touchEnabled : false,
				font : {
					fontSize : __l(15)
				}
			}));
			picker.appendRow(taobao);
			var picker_view = PickerView.create_picker_view(picker, function() {

			});

			win.add(picker_view);
			picker_view.animate(PickerView.picker_slide_in);
		});
		weixin_row.add(Ti.UI.createLabel({
			left : __l(16),
			top : Ti.App.is_android ? __l(12) : __l(14),
			bottom : __l(12),
			width : __l(80),
			touchEnabled : false,
			font : {
				fontSize : __l(16)
			},
			color : "#333",
			text : "绑定账号"
		}));

		var url = Ti.App.mamashai + "/api/account/get_binds?" + account_str();
		function get_bind(e) {
			var json = JSON.parse(e.responseText);
			weixin_row.json = json;

			if (weixin_row._wrapper)
				weixin_row.remove(weixin_row._wrapper);

			var weixin_wrapper = Ti.UI.createView({
				layout : 'horizontal',
				right : Ti.App.is_android ? __l(40) : __l(2),
				top : 0,
				bottom : 0,
				touchEnabled : false,
				width : Ti.UI.SIZE
				//width: __l(180)
			});

			//clear_window(weixin_wrapper);
			//weixin_row.remove(weixin_wrapper);

			if (json.weixin) {
				weixin_wrapper.add(Ti.UI.createImageView({
					left : __l(16),
					right : __l(0),
					top : __l(12),
					width : __l(20),
					height : __l(20),
					touchEnabled : false,
					image : "/images/login/bind_weixin.png",
				}));
			}
			if (json.qq) {
				weixin_wrapper.add(Ti.UI.createImageView({
					left : __l(16),
					right : __l(0),
					top : __l(12),
					width : __l(20),
					height : __l(20),
					touchEnabled : false,
					image : "/images/login/bind_qq.png",
				}));
			}
			if (json.weibo) {
				weixin_wrapper.add(Ti.UI.createImageView({
					left : __l(16),
					right : __l(0),
					top : __l(12),
					width : __l(20),
					height : __l(20),
					touchEnabled : false,
					image : "/images/login/bind_sina.png",
				}));
			}
			if (json.tencent) {
				weixin_wrapper.add(Ti.UI.createImageView({
					left : __l(16),
					right : __l(0),
					top : __l(12),
					width : __l(20),
					height : __l(20),
					touchEnabled : false,
					image : "/images/login/bind_tencent.png",
				}));
			}

			if (json.taobao) {
				weixin_wrapper.add(Ti.UI.createImageView({
					left : __l(16),
					right : __l(0),
					top : __l(12),
					width : __l(20),
					height : __l(20),
					touchEnabled : false,
					image : "/images/login/bind_taobao.png",
				}));
			}

			weixin_row._wrapper = weixin_wrapper;
			weixin_row.add(weixin_wrapper);
			//weixin_row.add(weixin_wrapper);
		}

		http_call(url, get_bind);

		//微信登录
		function ios_resumed(e) {
			var url2 = '';
			if (Ti.App.is_android) {
				url2 = Ti.App.mamashai + "/api/account/login_by_weixin/" + user_id() + "?key=" + Ti.App.wechat_key + "&code=" + Ti.App.Properties.getString('w_code', '');
			} else {
				if (e.url && e.url.indexOf("auth") > 0) {
					url2 = Ti.App.mamashai + "/api/account/login_by_weixin/?url=" + encodeURI(e.url);
				} else {
					return;
				}
			}

			http_call(url2, function(e) {
				json = JSON.parse(e.responseText);
				if (json.errmsg) {
					show_alert("提示", json.errmsg);
					return;
				}

				show_notice("绑定微信账号成功");

				http_call(url, get_bind);
			});
		}


		Ti.App.addEventListener("ios_resumed", ios_resumed);
		win.addEventListener("close", function(e) {
			Ti.App.removeEventListener("ios_resumed", ios_resumed);
		});
		win.addEventListener("focus", function(e) {
			var now = new Date();

			//小于3秒
			if (now.getTime() - parseInt(Ti.App.Properties.getString('w_occur_at', '')) < 3000) {
				Ti.App.fireEvent("ios_resumed");
			}
		});

		function bind_taobao() {
			show_notice("绑定淘宝账号成功");
			http_call(url, get_bind);
		}

		function bind_sina() {
			show_notice("绑定微博账号成功");
			http_call(url, get_bind);
		}

		function bind_tencent() {
			show_notice("绑定腾讯微博成功");
			http_call(url, get_bind);
		}

		function bind_qzone() {
			show_notice("绑定QQ账号成功");
			http_call(url, get_bind);
		}


		Ti.App.addEventListener("taobao_login", bind_taobao);
		Ti.App.addEventListener("sina_login", bind_sina);
		Ti.App.addEventListener("tencent_login", bind_tencent);
		Ti.App.addEventListener("qzone_login", bind_qzone);
		win.addEventListener("close", function(e) {
			Ti.App.removeEventListener("taobao_login", bind_taobao);
			Ti.App.removeEventListener("sina_login", bind_sina);
			Ti.App.removeEventListener("tencent_login", bind_tencent);
			Ti.App.removeEventListener("qzone_login", bind_qzone);
		});

		var save_profile_row = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			backgroundColor : "white",
		});
		var save_profile_title = Ti.UI.createLabel({
			left : __l(10),
			right : __l(10),
			top : __l(10),
			bottom : __l(8),
			height : Ti.UI.SIZE,
			font : {
				fontSize : __l(18)
			},
			color : Ti.App.bar_color,
			textAlign : 'center',
			text : "保存"
		});
		save_profile_row.addEventListener("click", function() {
			var update_xhr = Ti.Network.createHTTPClient()
			update_xhr.timeout = Ti.App.timeout
			update_xhr.onerror = function() {
				show_notice("修改资料失败，请检查网络")
			};
			update_xhr.onload = function() {
				if (update_xhr.upload_logo) {
					update_xhr.upload_logo = false;
					url = Ti.App.mamashai + "/api/account/update_profile.json?name=" + name_field.value + "&gender=" + gender_field.back_value + "&" + account_str();
					update_xhr.open('POST', url);
					update_xhr.send();
				} else {
					hide_loading();
					if (this.responseText == "error") {
						show_notice("对不起，该昵称已被占用了")
					} else {
						require('lib/mamashai_db').db.insert_json("user_profile", user_id(), this.responseText)
						show_notice("修改资料成功")
					}
				}
			};

			if (user_logo.file) {
				var url = Ti.App.mamashai + "/api/account/update_profile_image.json?" + account_str();
				update_xhr.open('POST', url);
				update_xhr.send({
					image : user_logo.file
				});
				update_xhr.upload_logo = true
				show_loading();
			} else {
				url = Ti.App.mamashai + "/api/account/update_profile.json?name=" + name_field.value + "&" + account_str();
				update_xhr.open('POST', url);
				update_xhr.send({
					gender : Ti.App.is_android ? gender_picker_android.value : gender_field.back_value
				});
				show_loading();
			}
		});
		save_profile_row.add(save_profile_title);

		gender.add(gender_title);
		if (Ti.App.is_android) {
			gender.add(gender_picker_android);
		} else {
			gender.add(gender_field);
		}
		section1.add(logo_row);
		section1.add(name);
		section1.add(gender);
		section1.add(city_row);
		section1.add(weixin_row);
		section1.add(save_profile_row);

		var save_row = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : '',
			backgroundColor : "white",
			textAlign : 'center'
		});
		var save_title = Ti.UI.createLabel({
			left : __l(10),
			right : __l(10),
			top : __l(10),
			bottom : __l(8),
			height : Ti.UI.SIZE,
			font : {
				fontSize : __l(18)
			},
			color : Ti.App.bar_color,
			textAlign : 'center',
			text : "添加宝宝"
		});
		save_row.add(save_title)
		save_row.addEventListener("click", function() {
			var win_kid = Titanium.UI.createWindow({
				url : "profile_kid.js",
				title : "宝宝资料设置",
				json : {},
				prev : win,
				backgroundColor : '#fff'
			});

			win_kid.backButtonTitle = ""
			pre(win_kid)
			Ti.App.currentTabGroup.activeTab.open(win_kid, {
				animated : true
			});
		})
		//tableview.appendRow(save_row);

		var gender_picker = Titanium.UI.createPicker({
			useSpinner : true,
			selectionIndicator : true,
			width : Ti.App.platform_width,
			visibleItems : visible_items()
		});
		var data = [];
		data[0] = Ti.UI.createPickerRow({
			title : '妈妈',
			custom_item : 'w'
		});
		data[1] = Ti.UI.createPickerRow({
			title : '爸爸',
			custom_item : 'm'
		});
		var column1 = Ti.UI.createPickerColumn({
			rows : data
		});
		if (Ti.App.is_android)
			column1.width = Ti.App.platform_width;
		gender_picker.add(column1);

		var only_fresh_parent = false;
		gender_picker.addEventListener('change', function(e) {
			gender_field.blur();
			if (gender_picker.no_event && !Ti.App.is_android) {
				gender_picker.no_event = false;
				return;
			}

			gender_field.value = e.row.title;
			gender_field.back_value = e.row.custom_item;

			if (Ti.App.is_android) {
				gender.remove(gender_field);
				//alert(gender_field.value)
				//gender.add(gender_field);
			}
		});

		Ti.App.Properties.setString("name", json.name);
		if (json.gender == 'm') {
			if (json.user_kids && json.user_kids.length > 0)
				gender_field.value = "爸爸";
		} else {
			if (json.user_kids && json.user_kids.length > 0)
				gender_field.value = "妈妈";
		}
		user_logo.image = Ti.App.aliyun + encodeURI(json.logo_url_thumb140);

		if (win.prev && xhr.refresh_prev) {
			win.prev.refresh();
		}

		if (only_fresh_parent) {
			only_fresh_parent = false;
			return;
		}

		tableview.addEventListener("click", function(e) {
			if (e.source.tp == 'kid') {
				show_window("profile_kid.js", {
					title : "宝宝资料设置",
					json : e.source.json,
					prev : win,
				})
			}
		})
		function add_kid_section(json) {
			var header_view = Ti.UI.createView({
				height : Ti.App.is_android ? __l(40) : __l(30)
			})
			header_view.add(Ti.UI.createLabel({
				text : "宝宝信息",
				color : "#333",
				font : {
					fontSize : __l(14)
				},
				top : Ti.App.is_android ? __l(8) : __l(0),
				bottom : __l(10),
				left : __l(20)
			}))
			add_btn = Ti.UI.createButton({
				title : "添加宝宝",
				font : {
					fontSize : __l(14)
				},
				top : Ti.App.is_android ? __l(8) : __l(0),
				right : __l(20),
				bottom : __l(10),
				color : Ti.App.bar_color,
				selectedColor : "#C64A74",
				backgroundColor : 'transparent'
			})

			add_btn.addEventListener("click", function(e) {
				show_window("profile_kid.js", {
					json : {},
					title : "宝宝资料设置",
					prev : win
				})
			})
			if (json.user_kids.length < 3) {
				header_view.add(add_btn)
			}
			var baby_section = Ti.UI.createTableViewSection({
				headerView : header_view
			});

			for (var i = 0; i < json.user_kids.length; i++) {
				var kid_json = json.user_kids[i]
				var kid = Ti.UI.createTableViewRow({
					tp : 'kid',
					height : __l(44),
					hasChild : Ti.App.is_android ? false : true,
					json : kid_json,
					backgroundColor : "white",
					selectedBackgroundColor : "#E8E8E8",
					iskid : true
				});

				var kid_logo = Ti.UI.createImageView({
					top : __l(9),
					left : __l(20),
					width : __l(26),
					height : __l(26),
					defaultImage : "./images/default.gif",
					image : Ti.App.aliyun + encodeURI(kid_json.logo_url_thumb75),
					touchEnabled : false,
					hires : true
				});

				var kid_name = Ti.UI.createLabel({
					left : __l(60),
					top : Ti.App.is_android ? __l(2) : __l(14),
					bottom : Ti.App.is_android ? __l(2) : __l(12),
					font : {
						fontSize : __l(16)
					},
					touchEnabled : false,
					color : "#333",
					text : kid_json.name + ' ' + detail_age_for_birthday(kid_json.birthday)
				});
				kid.add(kid_logo);
				kid.add(kid_name);
				if (Ti.App.is_android) {
					kid.add(Ti.UI.createImageView({
						top : __l(12),
						bottom : __l(12),
						height : __l(20),
						width : __l(20),
						right : __l(6),
						touchEnabled : false,
						image : "/images/table_right.png"
					}))
				}

				baby_section.add(kid)
			};

			
			tableview.appendSection(baby_section)
		}

		tableview.appendSection(section1);
		add_kid_section(json)

		//删除宝宝的行，重新获取
		win.refresh_table = function() {
			tableview.deleteSection(1);
			url = Ti.App.mamashai + "/api/users/show.json?id=" + Ti.App.Properties.getString("userid") + "&" + account_str();
			http_call(url, function(e) {
				var json = JSON.parse(e.responseText);
				add_kid_section(json);
			});
		};
	}

	http_call(Ti.App.mamashai + "/api/users/show/" + win.id + "?v=2&" + account_str(), function(e) {
		if (this.responseText == "deleted") {
			show_alert("提示", "该用户已被禁");
			return;
		}

		var json = JSON.parse(e.responseText);

		require('lib/mamashai_db').db.insert_json("user_profile", win.id, e.responseText);

		//如果是自己
		make_profile_table_view(json);
	});

	return win;
}

module.exports = Profile;

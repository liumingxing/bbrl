function UserWindow(attr) {
	Ti.include("public.js");

	var win = Titanium.UI.createWindow(attr);
	win.backgroundColor = "white";
	//判断是否显示关注按钮
	if (parseInt(win.id) != (Ti.App.Properties.getString("userid"))) {
		var following = false;
		var xhr = Ti.Network.createHTTPClient();
		xhr.timeout = Ti.App.timeout;
		var more = Ti.UI.createButton({
			title : "操作"
		});
		more.addEventListener("click", function(e) {
			if (!check_login()) {
				to_login();
				return;
			}
		});
		if (!Ti.App.is_android)
			win.setRightNavButton(more);
		else {
			add_default_action_bar2(win, win.title, Ti.Android.R.drawable.ic_menu_more, function() {
				more.fireEvent("click");
			});
		}
		xhr.onload = function() {
			var json = JSON.parse(this.responseText);
			following = json.source.following;

			more.addEventListener("click", function(m) {
				var options = json.source.followed_by ? [ following ? "取消关注" : "关注", "送礼物", "发私信", "取消"] : [ following ? "取消关注" : "关注", "送礼物", '举报', "取消"];
				var optionsDialogOpts = {
					options : options,
					cancel : 3
				};
				var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
				dialog.addEventListener("click", function(e) {
					if (e.index == 0) {//关注
						if (json.source.following) {
							http_call(Ti.App.mamashai + "/api/friendships/destroy.json?id= " + win.id + "&" + account_str(), function(e) {
								hide_loading();
								show_notice("取消关注成功");
								following = false;
							});
							show_loading();
						} else {
							http_call(Ti.App.mamashai + "/api/friendships/create.json?id= " + win.id + "&" + account_str(), function(e) {
								hide_loading();
								show_notice("关注成功！");
								following = true;
							});
						}
					} else if (e.index == 1) {//送礼物
						show_window("gifts.js", {
							title : "送礼物",
							id : win.id
						});
					} else if (e.index == 2) {//发私信 or 举报
						if (json.source.followed_by) {
							show_window("write_message.js", {
								title : "写私信",
								name : json.target.name,
								text : "",

							});
						} else {
							show_window("write_message.js", {
								title : "举报用户",
								name : "妈妈晒",
								text : "管理员你好，我举报用户" + json.target.name + "，原因是："
							});
						}
					}
				});
				dialog.show()
			});
		};
		var url = Ti.App.mamashai + "/api/friendships/show.json?source_id=" + Ti.App.Properties.getString("userid", "") + "&target_id=" + win.id + "&" + account_str();
		if (check_login()) {
			xhr.open('GET', url);
			xhr.send();
		}
	}
	else{
		var right = Ti.UI.createButton({
			title: "日历"
		});
		right.addEventListener("click", function(e){
			Ti.App.util.show_window(Ti.App.mamashai + "/bbrl_code/calendar.txt", {
				title: "日历"
			});
		});
		if (!Ti.App.is_android){
			win.setRightNavButton(right);
		}
		else{
			add_default_action_bar2(win, win.title, Ti.Android.R.drawable.ic_menu_month, function(e){
				right.fireEvent("click");
			});
		}
	}

	win.addEventListener("open", function(e) {
		var user_container = Ti.UI.createView({
			top : Ti.App.android_offset,
			left : 0,
			backgroundImage : "/images/person_bg.jpg",
			height : __l(86),
			right : 0,
		});

		var user_logo_container = Ti.UI.createView({
			top : __l(17),
			height : __l(60),
			width : __l(60),
			left : __l(13),
			borderWidth : 1,
			borderColor : "#DFE1E1",
			backgroundColor : "white"
		});

		var user_logo = Ti.UI.createImageView({
			top : __l(2),
			left : __l(2),
			right : __l(2),
			bottom : __l(2),
			//width : __l(56),
			//height : __l(56),
			defaultImage : "./images/default.gif",
			hires : true
		});

		user_logo.addEventListener("click", function() {
			galary_browse([user_logo.image_large], 0);
		});

		var name_wrapper_transparent = Ti.UI.createView({
			left : __l(83),
			right : __l(10),
			top : __l(17),
			bottom : __l(10),
			borderRadius : __l(6),
			opacity : 0.5,
			backgroundColor : "white"
		});
		user_container.add(name_wrapper_transparent);
		var name_wrapper = Ti.UI.createView({
			left : __l(83),
			right : __l(10),
			top : __l(17),
			bottom : __l(10)
		});
		user_container.add(name_wrapper);

		var top_wrapper = Ti.UI.createView({
			left : 0,
			top : __l(2),
			height : __l(24),
			width : Ti.UI.SIZE,
			layout : 'horizontal'
		});

		var user_sex = Ti.UI.createImageView({
			top : __l(4),
			left : __l(4),
			height : __l(16),
			width : __l(16)
		});

		var user_name = createEmojiLabel({
			top : __l(4),
			left : __l(6),
			height : __l(17),
			font : {
				fontSize : __l(14),
				fontWeight : 'bold'
			},
			fontWeight : 'bold',
			color : "#333333",
			text : ""
		});

		if (Ti.App.Properties.getString("is_mms_admin", "false") == "true") {//是管理员
			user_name.addEventListener("click", function(e) {
				var optionsDialogOpts = {
					options : ['进私有黑名单', '进记录黑名单', '进星星榜黑名单', '删除' + e.source.text, '取消'],
					cancel : 4
				};

				var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
				dialog.addEventListener("click", function(e1) {
					if (e1.index == 0) {
						http_call(Ti.App.mamashai + "/api/admin/black_private/" + win.id + "?" + account_str(), function(e) {
							show_notice(e.responseText);
						});
					} else if (e1.index == 1) {
						http_call(Ti.App.mamashai + "/api/admin/black_write/" + win.id + "?" + account_str(), function(e) {
							show_notice(e.responseText);
						});
					} else if (e1.index == 2) {
						http_call(Ti.App.mamashai + "/api/admin/black_xxb/" + win.id + "?" + account_str(), function(e) {
							show_notice(e.responseText);
						});
					} else if (e1.index == 3) {
						var alert_dialog = Titanium.UI.createAlertDialog({
							title : '提示',
							message : '确定要删除用户' + e.source.text + '吗？',
							buttonNames : ['取消', '确定'],
							cancel : 0
						});
						alert_dialog.addEventListener("click", function(e) {
							if (e.index == 1) {
								http_call(Ti.App.mamashai + "/api/admin/delete_user/" + win.id + "?" + account_str(), function(e) {
									win.close();
									show_notice(e.responseText);
								});
							}
						});
						alert_dialog.show();
					}
				});
				dialog.show();
			});
		}

		var user_level = Ti.UI.createImageView({
			top : __l(8),
			left : __l(4),
			height : __l(10),
			width : __l(35),
			hires : true
		});

		top_wrapper.add(user_name);
		top_wrapper.add(user_sex);
		top_wrapper.add(user_level);

		user_level.addEventListener("click", function(e) {
			cache_http_call("http://www.mamashai.com/bbrl_code/user_level.txt", "user_level", function(e) {
				eval(e.responseText);
			});
		});

		var user_city = Ti.UI.createLabel({
			top : __l(27),
			left : __l(6),
			height : __l(30),
			font : {
				fontSize : __l(11)
			},
			color : "#333",
			text : ''
		});

		var user_kid0 = createEmojiLabel({
			top : __l(27),
			right : __l(6),
			height : __l(30),
			font : {
				fontSize : __l(11)
			},
			color : "#333",
			textAlign : 'right',
			text : ''
		});

		var line = Ti.UI.createImageView({
			image : "/images/person_line.png",
			top : __l(6),
			bottom : __l(6),
			left : __l(100)
		});

		user_logo_container.add(user_logo);
		user_container.add(user_logo_container);
		name_wrapper.add(top_wrapper);
		name_wrapper.add(user_city);
		name_wrapper.add(user_kid0);
		user_container.add(Ti.UI.createView({
			left : 0,
			right : 0,
			bottom : 0,
			height : __l(1),
			backgroundColor : "#ccc"
		}));
		win.add(user_container);

		var count_wrapper = Ti.UI.createView({
			top : __l(87),
			left : 0,
			right : 0,
			width : Ti.App.platform_width,
			height : __l(50),
			backgroundColor : "#F5F7EF",
			layout : 'horizontal'
		});

		var btn_width = (Ti.App.platform_width - __l(20)) / 3;

		function add_rect_button(text, has_line, click) {
			var button_wrapper = Ti.UI.createView({
				left : __l(3),
				top : __l(4),
				bottom : __l(4),
				width : btn_width,
				right : 0,
			});
			button_wrapper.addEventListener("touchstart", function(e) {
				e.source.backgroundColor = "#E5E7DF";
			});
			button_wrapper.addEventListener("touchend", function(e) {
				e.source.backgroundColor = "transparent";
				e.source.count.backgroundColor = "transparent";
				e.source.label.backgroundColor = "transparent";
			});
			button_wrapper.addEventListener("click", function(e) {
				click(e);
			});

			var count = Titanium.UI.createLabel({
				text : '',
				top : __l(2),
				height : __l(20),
				left : 0,
				right : 0,
				color : "#D76085",
				font : {
					fontSize : __l(15)
				},
				touchEnabled : false,
				textAlign : "center",
				backgroundSelectedColor : "transparent",
				button : button_wrapper
			});
			button_wrapper.count = count;

			var label = Ti.UI.createLabel({
				top : __l(22),
				height : Ti.UI.SIZE,
				font : {
					fontSize : __l(14)
				},
				textAlign : "center",
				touchEnabled : false,
				color : "#333",
				backgroundSelectedColor : "transparent",
				text : text
			});
			button_wrapper.label = label;
			button_wrapper.add(count);
			button_wrapper.add(label);
			count_wrapper.add(button_wrapper);

			if (has_line) {
				var line = Ti.UI.createImageView({
					width : __l(1),
					top : __l(4),
					bottom : __l(4),
					left : __l(3),
					//right: __l(3),
					image : "/images/person_line.png"
				});
				count_wrapper.add(line);
			}

			return count;
		}

		var weibo_count_label = add_rect_button("时光轴", true, function(e) {
			show_window("post_album", {
				id : win.id,
				title: "时光轴"
			});
		});

		var follow_count = add_rect_button("关注", true, function(e) {
			if (!check_login()) {
				to_login();
				return;
			}
			
			show_window("followers", {
				title : e.source.tag,
				id : win.id,
				m_url : "friends"
			});
		});

		var fans_count = add_rect_button("粉丝", false, function(e) {
			if (!check_login()) {
				to_login();
				return;
			}
			
			show_window("followers", {
				title : e.source.tag,
				id : win.id,
				m_url : "followers"
			});
		});

		function set_user_info(json) {
			user_name.text = json.name
			if (parseInt(json.id) == parseInt(Ti.App.Properties.getString("userid"))) {
				follow_count.button.tag = "我的关注";
				fans_count.button.tag = "我的粉丝";
			} else {
				follow_count.button.tag = json.name + "的关注";
				fans_count.button.tag = json.name + "的粉丝";
			}

			if (json.gender == "m") {
				user_sex.image = "/images/men.png";
			} else {
				user_sex.image = "/images/women.png";
			}

			user_city.text = json.province_name ? (json.province_name || '') + (json.city_name || '') : '地球';

			user_level.image = "/images/level/" + json.mms_level + ".png";

			user_logo.image = Ti.App.aliyun + encodeURI(json.logo_url_thumb140);
			user_logo.image_large = Ti.App.aliyun + encodeURI(json.logo_url);

			function kid_desc(json) {
				var str = "";
				var detail = "";
				if (json.birthday && json.birthday.length > 0)
					detail = detail_age_for_birthday(json.birthday)

				if (detail.indexOf("孕") == 0) {
					//
				} else {
					if (json.gender == "m")
						str += "儿子"
					else
						str += "女儿"
				}

				if (json.name && json.name.length > 0)
					str += json.name
				if (json.birthday && json.birthday.length > 0)
					str += "" + detail;
				return str;
			}

			var kid_text = '';
			if (json.user_kids.length > 0) {
				kid_text = kid_desc(json.user_kids[0]);
			}
			if (json.user_kids.length > 1) {
				kid_text += "\n" + kid_desc(json.user_kids[1]);
			}
			user_kid0.text = kid_text;
			follow_count.text = json.follow_users_count;
			fans_count.text = json.fans_users_count;

			if (json.posts_count > 0)
				weibo_count_label.text = json.posts_count;
			else
				weibo_count_label.text = "0";
		}

		//获得用户详细信息
		var xhr1 = Ti.Network.createHTTPClient()
		xhr1.timeout = Ti.App.timeout
		xhr1.onerror = function() {
			hide_loading();
			if (Titanium.Network.online) {
				show_notice("获取数据失败");
				show_timeout_dlg(xhr1, url1);
			}
		};
		xhr1.onload = function() {
			if (this.responseText == "deleted") {
				show_alert("提示", "该用户已被禁");
				return;
			}

			var json = JSON.parse(this.responseText);
			set_user_info(json);

			require('lib/mamashai_db').db.insert_json("user_profile", win.id, this.responseText);

			var Mamashai = require("lib/mamashai_ui");
			//Mamashai.ui.tab = Ti.App.currentTabGroup.activeTab
			var tableview = Mamashai.ui.make_weibo_tableview("my", Ti.App.mamashai + "/api/statuses/user_timeline.json?id=" + win.id, win.id, "posts");
			tableview.headerView = count_wrapper;
			tableview.top = __l(86) + Ti.App.android_offset;
			tableview.bottom = 0;
			win.add(make_tableview_pull(tableview));
			tableview.send();
		};
		var json_row = require('/lib/mamashai_db').db.select_with_check("user_profile", win.id);

		if (!json_row.blank) {
			var json = JSON.parse(json_row.json);
			set_user_info(json);
		}
		var url1 = Ti.App.mamashai + "/api/users/show/" + win.id + "?v=2&" + account_str();
		xhr1.open('GET', url1);
		xhr1.send();

		win.refresh = function() {
			xhr1.open('GET', url1);
			xhr1.send();
		};

		logEvent('user', {
			id : win.id
		});
	});

	pre(win);
	add_default_action_bar(win, win.title, true);
	return win;
}

module.exports = UserWindow; 
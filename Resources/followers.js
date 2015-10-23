function Followers(attr) {
	Ti.include("public.js");
	var win = Titanium.UI.createWindow(attr);
	add_default_action_bar(win, win.title, true);
	var canvas = Ti.UI.createScrollView({
		contentHeight : 'auto',
		contentWidth : Ti.App.platform_width,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		layout : 'horizontal',
		//layout: 'vertical',
		left : 0,
		top : 0,
		bottom : 0,
		right : 0,
		textAlign : "center"
	});

	win.add(canvas);

	var more_button = Titanium.UI.createButton({
		top : __l(10),
		bottom : __l(6),
		left : (Ti.App.platform_width - __l(300)) / 2,
		width : __l(300),
		height : __l(40),
		title : "下一页",
		font : {
			fontSize : __l(18)
		}
	});
	pre_btn(more_button);
	more_button.addEventListener("click", function() {
		show_loading();
		page += 1;
		var url = Ti.App.mamashai + "/api/statuses/" + win.m_url + ".json?count=15&page=" + page + "&id=" + win.id + "&" + account_str();
		xhr.open('GET', url);
		xhr.send();
	});

	var add_more = false;
	/*
	 var current_row = Titanium.UI.createView({
	 top : 0,
	 left : Titanium.Platform.osname == 'ipad' ? 50 : 0,
	 height: Ti.UI.SIZE,
	 right :  0,
	 layout: 'horizontal'
	 });
	 canvas.add(current_row)
	 */

	var xhr = Ti.Network.createHTTPClient()
	xhr.timeout = Ti.App.timeout
	xhr.onerror = function() {
		show_notice("获取数据失败");
		hide_loading();
		show_timeout_dlg(xhr, url);
	};
	xhr.onload = function() {
		hide_loading();
		var json = JSON.parse(this.responseText);

		if (this.responseText == "null" || json.length == 0) {
			if (win.m_url == "followers") {
				if (page == 1)
					show_notice("还没有粉丝呢");
				else
					show_notice("没有了");
			} else {
				if (page == 1)
					show_notice("还没有关注他人呢");
				else
					show_notice("没有了");
			}
			if (add_more) {
				canvas.remove(more_button);
				add_more = false;
			}
		} else {
			var count = 0;
			var w = Ti.UI.createView({
				left : 0,
				right : 0,
				top : 0,
				height : Ti.UI.SIZE,
				layout : 'horizontal'
			});
			for (var i = 0; i < json.length; i++) {
				var button_wrapper = Titanium.UI.createView({
					top : __l(8),
					left : (Ti.App.platform_width - __l(80) * 3) / 4,
					width : __l(80),
					height : __l(80),
					borderColor : "#9F8652",
					borderWidth : 1,
					json : json[i],
					borderRadius : __l(8)
				});

				button_wrapper.addEventListener("touchstart", function(e) {
					e.source.backgroundColor = "#E5E7DF";
				});
				button_wrapper.addEventListener("touchend", function(e) {
					e.source.backgroundColor = "transparent";
				});
				button_wrapper.addEventListener("touchcancel", function(e) {
					e.source.backgroundColor = "transparent";
				});

				button_wrapper.addEventListener("click", function(e) {
					show_window("user", {
						title : e.source.json.name,
						id : e.source.json.id
					});
				});

				var user_logo = Ti.UI.createImageView({
					top : __l(4),
					width : __l(38),
					height : __l(38),
					defaultImage : "./images/default.gif",
					hires : true,
					button : button_wrapper,
					touchEnabled : false,
					image : Ti.App.aliyun + encodeURI(json[i].logo_url_thumb140)
				});
				button_wrapper.add(user_logo)

				var user_name = Ti.UI.createLabel({
					bottom : __l(21),
					left : __l(2),
					right : __l(2),
					height : __l(16),
					font : {
						fontSize : __l(12)
					},
					text : json[i].name,
					color : "#333",
					button : button_wrapper,
					touchEnabled : false,
					textAlign : "center"
				});
				button_wrapper.add(user_name);

				var kid_name = Ti.UI.createLabel({
					bottom : __l(6),
					left : __l(1),
					right : __l(1),
					height : __l(15),
					font : {
						fontSize : __l(11)
					},
					color : "#333",
					textAlign : "center",
					button : button_wrapper,
					touchEnabled : false,
					text : "备孕"
				});
				if (json[i].user_kids && json[i].user_kids.length > 0) {
					var kid_json = json[i].user_kids[0]

					var str = "";
					if (kid_json.gender == 'm') {
						str += "儿子"
					} else if (kid_json.gender == 'f') {
						str += '女儿'
					}
					if (kid_json.birthday && kid_json.birthday.length > 4)
						str += detail_age_for_birthday(kid_json.birthday);
					kid_name.text = str;
				}
				button_wrapper.add(kid_name);

				w.add(button_wrapper);
			}
			canvas.add(w);
			if (add_more) {
				canvas.remove(more_button);
				add_more = false;
			}

			if (json.length == 15){
				canvas.add(more_button);
				add_more = true;
			}
		}
	};

	var page = 1;
	var url = Ti.App.mamashai + "/api/statuses/" + win.m_url + ".json?count=15&page=" + page + "&id=" + win.id + "&" + account_str();
	xhr.open('GET', url);
	xhr.send();
	logEvent(win.m_url, {
		id : win.id
	});

	return win;
}

module.exports = Followers; 